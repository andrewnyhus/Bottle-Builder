from .views import *

'''
    Serves the view bottle building page if the user is allowed to view that design.
    Otherwise, the user is told they are unauthorized.
'''
#===============================================================================
@never_cache
@ensure_csrf_cookie
def view_bottle_building(request, building_id):


    try:
        building = Bottle_Building.objects.get(pk=building_id)

        # if user is unauthenticated
        # building must be visible to public or to those with the link
        # otherwise, respond saying that the user is unauthorized
        if not(request.user.is_authenticated()) and not(building.visible_to_public or building.visible_to_those_with_link):
            return render(request, "unauthorized_request.html")

        # if user is authenticated
        # building must be visible to public, members or those with the link, or it must be created by user
        # otherwise, respond saying that the user is unauthorized
        if request.user.is_authenticated() and not(building.visible_to_public or building.visible_to_members or building.visible_to_those_with_link or (request.user.pk == building.created_by.pk)):
            return render(request, "unauthorized_request.html")

        coordinates = Coordinates.objects.filter(bottle_building=building)
        link = request.build_absolute_uri("/view_bottle_building/building_id=" + str(building.pk))

        return render(request, "view_bottle_building.html", {"building": building, "coordinates": coordinates, "link": link})
    except Exception as exc:
        return render(request, "error.html", {"message": "Sorry! We had a problem loading the bottle building."})
#===============================================================================


'''
    Serves the design bottle building page.
'''
#===============================================================================
@never_cache
@ensure_csrf_cookie
def design_bottle_building(request):
    return render(request, "design_bottle_building.html", {"use_imperial_system": True})
#===============================================================================


'''
    Handles delete bottle building design requests.
    If the user is authenticated, active and the owner of the building matching
    the specified building id, the building is deleted.
'''
#===============================================================================
@api_view(['POST'])
def delete_bottle_building_design(request, building_id):
    try:
        building = Bottle_Building.objects.get(pk=building_id)
        if request.user.is_authenticated() and request.user.is_active and (request.user.pk == building.created_by.pk):
            building.delete()
            return Response("Successfully Deleted", status=status.HTTP_200_OK)
        return Response("Could not delete building because you are unauthorized or inactive.", status=status.HTTP_401_UNAUTHORIZED)
    except Exception as exc:
        return Response("Error deleting bottle building.  Make sure the proper id was provided.", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
#===============================================================================



'''
    Handles post bottle building design requests.
    If the user is authenticated and active, and the data for the new building
    is valid, create the new building.
    Otherwise returns an appropriate response.
'''
#===============================================================================
@api_view(['POST'])
def post_bottle_building_design(request):

    if request.user.is_authenticated() and request.user.is_active:
        coordinate_array = list()

        title = None

        bottle_estimate = None
        cement_estimate = None
        fill_estimate = None

        bottle_estimate_units = None
        cement_estimate_units = None
        fill_estimate_units = None

        walls = list()

        data_string = request.data["data_string"]
        request_data = json.loads(data_string)


        #----------------------------------------------------------------------------------

        try:
            # get title
            title = request_data["title"]
            # get units of resource estimation
            bottle_estimate_units = request_data["resource_estimate"]["bottle_units"]
            cement_estimate_units = request_data["resource_estimate"]["cement_units"]

            fill_estimate_units = request_data["resource_estimate"]["fill_units"]

            # reject if building height units are too long
            if (len(request_data["building_height_units"]) > 10):
                return Response("Error: The building height exceed the 10 character limit", status=status.HTTP_400_BAD_REQUEST)

            # reject if bottle units are too long
            if (len(request_data["resource_estimate"]["bottle_units"]) > 70):
                return Response("Error: The bottle units exceed the 70 character limit", status=status.HTTP_400_BAD_REQUEST)

            # reject if cement units are too long
            if (len(request_data["resource_estimate"]["cement_units"]) > 20):
                return Response("Error: The cement units exceed the 70 character limit", status=status.HTTP_400_BAD_REQUEST)

            # reject if fill units are too long
            if (len(request_data["resource_estimate"]["fill_units"]) > 20):
                return Response("Error: The fill units exceed the 70 character limit", status=status.HTTP_400_BAD_REQUEST)

            # reject if title is too long
            if (len(request_data["title"]) > 40):
                return Response("Error: The title exceeds the 40 character limit", status=status.HTTP_400_BAD_REQUEST)
        except KeyError:
            return Response("Missing a piece of data", status=status.HTTP_400_BAD_REQUEST)
        #----------------------------------------------------------------------------------


        #----------------------------------------------------------------------------------
        # reject if one of the estimations is not valid
        try:

            bottle_estimate = int(request_data["resource_estimate"]["bottles"]["total"])
            cement_estimate = float(request_data["resource_estimate"]["cement"]["total"])
            fill_estimate = float(request_data["resource_estimate"]["fill"]["total"])

        except KeyError:
            return Response("Missing a piece of data", status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            return Response("Error: One of the estimations is not valid. Bottles should be ints, fill and cement should be floats", status=status.HTTP_400_BAD_REQUEST)
        #----------------------------------------------------------------------------------

        #----------------------------------------------------------------------------------
        # Check that the visibility settings are valid, store visibility settings
        visible_link = request_data["visible_link"]
        visible_members = request_data["visible_members"]
        visible_public = request_data["visible_public"]


        if not(visible_link == True or visible_link == False):
            return Response("Problem related to viewable by link settings", status=status.HTTP_400_BAD_REQUEST)
        if not(visible_link == True or visible_link == False):
            return Response("Problem related to viewable by members settings", status=status.HTTP_400_BAD_REQUEST)


        if not(visible_link == True or visible_link == False):
            return Response("Problem related to viewable by public settings", status=status.HTTP_400_BAD_REQUEST)
        #----------------------------------------------------------------------------------
        # reject if one of the coordinates is not valid
        #return Response(request_data["walls"]["1"]["0"], status=status.HTTP_400_BAD_REQUEST)
        try:

            for i in range(len(request_data["walls"])):
                longitude = float(request_data["walls"][str(i)]["0"][0])
                latitude = float(request_data["walls"][str(i)]["0"][1])
                coordinate = Coordinates.objects.create(longitude=longitude, latitude=latitude)
                coordinate_array.append(coordinate)
        except KeyError:
            return Response("Missing a piece of data", status=status.HTTP_400_BAD_REQUEST)
        except ValueError:
            # delete the coordinates we have already created in our database
            for coordinate in coordinate_array:
                coordinate.delete()
            return Response("Error: The coordinates for the walls are not floating point numbers.", status=status.HTTP_400_BAD_REQUEST)
        #----------------------------------------------------------------------------------

        #----------------------------------------------------------------------------------
        # Create building and send response with url pointing to building, otherwise report error
        try:
            building = Bottle_Building.objects.create(title=title, building_height=request_data["building_height"],
                building_height_units=request_data["building_height_units"], created_by=request.user,
                bottle_units=bottle_estimate_units, cement_units=cement_estimate_units, fill_units=fill_estimate_units,
                bottle_estimate=bottle_estimate, cement_estimate=cement_estimate, fill_estimate=fill_estimate,
                visible_to_public=visible_public, visible_to_members=visible_members, visible_to_those_with_link=visible_link)
            for coordinate in coordinate_array:
                coordinate.bottle_building = building
                coordinate.save()
            url_to_design = "/view_bottle_building/building_id=" + str(building.pk)
            # Return url of building that was created.
            return Response(url_to_design, status=status.HTTP_201_CREATED)
        except Exception as exc:
            return Response("There was a problem saving your building. It may have been created or partially created. Please check your profile.", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    elif request.is_authenticated():
        return Response("Please Activate Your Account", status=status.HTTP_401_UNAUTHORIZED)
    return Response("Please log in", status=status.HTTP_401_UNAUTHORIZED)
#===============================================================================


'''
    Handles the post building privacy changes requests.
    If user is authenticated, active and the owner of the building,
    apply the desired privacy changes. Otherwise, do not and return an appropriate response.
'''
#===============================================================================
@api_view(['POST'])
def post_building_privacy_changes(request):
    # ensure that the user is authenticated and active
    if request.user.is_authenticated() and request.user.is_active:

        # get data string
        data_string = str(request.data["data_string"])

        # construct array from data string
        request_data = json.loads(data_string)

        # ensure that a building pk is included in the data
        # and that the user is the owner of the building design
        # and that the necessary privacy info is in the data
        if (request_data["building_pk"] and request_data["is_visible_to_public"] and request_data["is_visible_to_members"] and request_data["is_visible_to_link"]):
            try:

                #convert building pk to int
                building_pk = int(request_data["building_pk"])


                # try to get building
                building = Bottle_Building.objects.get(pk=building_pk)

                # if user is building owner
                if request.user.pk == building.created_by.pk:

                    # cast visibility preferences to pythonic booleans
                    visible_to_public = True if request_data["is_visible_to_public"] == "true" else False
                    visible_to_members = True if request_data["is_visible_to_members"] == "true" else False
                    visible_to_link = True if request_data["is_visible_to_link"] == "true" else False

                    # set visibility preferences
                    building.visible_to_public = visible_to_public
                    building.visible_to_members = visible_to_members
                    building.visible_to_those_with_link = visible_to_link

                    building.save()

                    return Response("Privacy changes have been applied.", status=status.HTTP_200_OK)
                return Response("You are not the owner of the building design", status=status.HTTP_401_UNAUTHORIZED)

            # building does not exist
            except Bottle_Building.DoesNotExist:
                return Response("Building does not exist", status=status.HTTP_400_BAD_REQUEST)
            # error with regards to data types
            except ValueError:
                return Response("Invalid Data", status=status.HTTP_400_BAD_REQUEST)
            # general error
            except Exception as exc:
                return Response("There was a problem saving your privacy changes. Please try again.", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response("You are not the owner of the bottle building, or your account is inactive", status=status.HTTP_401_UNAUTHORIZED)
#===============================================================================
