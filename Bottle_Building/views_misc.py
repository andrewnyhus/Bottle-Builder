from .views import *


@never_cache
@ensure_csrf_cookie
def home(request):

    try:
        # initialize all design collections to None
        user_designs = None
        member_designs = None
        public_designs = None
        buildings = None

        user_is_member = False

        # populate building_designs
        # --------------------------------------------------------------------------
        # if user is authenticated, add user and member-visible designs to the mix of results
        if request.user.is_active and request.user.is_authenticated():
            user_designs = Bottle_Building.objects.filter(created_by=request.user)
            member_designs = Bottle_Building.objects.filter(visible_to_members=True)
            user_is_member = True

        # add public designs to the mix
        public_designs = Bottle_Building.objects.filter(visible_to_public=True)

        # if user is member, include user and member designs with public user_designs
        # and sort them by date
        if user_is_member:
            buildings = (public_designs | user_designs | member_designs).distinct().order_by('-created_on')[:15]

        # else, sort public designs
        else:
            buildings = public_designs.order_by("-created_on")[:15]
        # --------------------------------------------------------------------------

        # declare an array for building_designs
        building_designs = []

        # include coordinates
        # --------------------------------------------------------------------------

        # iterate through buildings created by user
        for building in buildings.all():
            # get coordinates
            design_coordinates = Coordinates.objects.filter(bottle_building=building)

            # get link for current design
            link = request.build_absolute_uri("/view_bottle_building/building_id=" + str(building.pk))

            # add building design to array
            building_designs.append({"building": building, "coordinates": design_coordinates, "link": link})
        # --------------------------------------------------------------------------


        return render(request, 'home.html', {"building_designs": building_designs})
    except Exception as exc:
        return render(request, "error.html", {"exception": str(exc)})





def about(request):
    return render(request, "about.html")




@api_view(['POST'])
@permission_classes((AllowAny, ))
def submit_feedback(request):
    try:
        feedback = request.data["feedback"]
        # if feedback is invalid, return invalid response,
        # otherwise, send email with feedback
        if len(feedback) == 0:
            return Response("Feedback is empty", status=status.HTTP_400_BAD_REQUEST)
        elif len(feedback) > 1000:
            return Response("Feedback exceeds 1000 characters", status=status.HTTP_400_BAD_REQUEST)
        else:

            subject = ""

            # if user is authenticated, include user info
            # otherwise, just send it anonymously
            if request.user.is_active and request.user.is_authenticated():
                username = str(request.user.username)
                email = str(request.user.email)
                subject = 'Feedback from "'+username+'" ('+email+')'
            else:
                subject = 'Anonymous feedback'

            # send email to admin email with feedback
            send_email(get_email_address(), subject, feedback)
            return Response("Feedback Submitted Successfully!", status=status.HTTP_200_OK)

    except Exception as exc:
        return Response("Error Submitting Feedback", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
