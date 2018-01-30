# Bottle-Builder

## What is a Bottle Building?
"In a bottle building, the walls are made by filling plastic bottles with sand, dirt or some other fill. These "bottle bricks" are then laid down in rows, with a layer of cement in between each row and column of bottles.

Not only are bottle buildings a great use of plastic bottles, they are very durable. I cannot confirm this, but according to various sources, these structures are: bulletproof, earthquake resistant, fireproof, and temperature retaining.

There are several ways to build a bottle building. If you want to find instructions, inspiration or just more information, check out [these search results](https://bottlebuilder.herokuapp.com/about/)."
Source: [Bottle Builder About Page](https://bottlebuilder.herokuapp.com/about/)


## What is Bottle Builder?
Bottle Builder is a website powered by Django Python. Bottle Builder allows users
to design the structure of their "Bottle Building" and Bottle Builder then provides
a theoretical estimate of the resources needed for construction. Bottle Builder does not
determine structural integrity of any building design, nor does Bottle Builder
comment on any local laws or building codes that may prevent a building design
from being constructed legally.

## How does the site work?

1. The user goes to [https://bottlebuilder.herokuapp.com/design_bottle_building/](https://bottlebuilder.herokuapp.com/design_bottle_building/)
and creates a bottle building design. They do this by entering the necessary information
and drawing the perimeter of the building on the map. Below is a screenshot of this.

![Drawing a bottle building design](/readme_images/draw_building.png)

If the user is authenticated, they can choose to post this building design, and they
can allow it to be seen by: only themselves, only members, only those with a link,
or by the general public.

2. Bottle building designs can then be viewed on the [home page](https://bottlebuilder.herokuapp.com/),
or at the building's individual page. If the user is authenticated they can view the building designs
they created at their profile page. A screenshot of a view of a bottle building design is below.

![A view of a bottle building design](/readme_images/view_building.png)

## Project structure
