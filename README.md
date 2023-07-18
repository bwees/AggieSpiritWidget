# Aggie Spirit iOS Widget

<img width="256" alt="Screenshot 2023-07-18 at 3 33 59 PM" src="https://github.com/bwees/AggieSpiritWidget/assets/12686250/5bc4fd82-db89-4a51-89c5-8fcbf6b62ce0">

*WARNING: This is still a work in progress. Please report bugs in the issues tab.*

# Installation Steps:
1. Install the [Scriptable App](https://scriptable.app/)
2. Copy the code found [here](https://raw.githubusercontent.com/bwees/AggieSpiritWidget/main/aggie_spirit.js)
4. Open the Scriptable app and tap the + icon at the upper-left corner of the screen.
5. Paste the code inside the blank area.
6. Tap the name at the top, normally called Untitled Script, then change it to whatever name you want

# Widget Steps
1. Add a Scriptable widget to your home screen
2. Long press on the widget and tap "Edit Widget"
3. Select the script that you titled in Step 6 above
4. Under "Parameter" enter a configuration that you create from the steps below

# Configuration
1. Pull up the buses you want to add on https://transport.tamu.edu/busroutes/
2. For this tutorial, we are going to use bus 12
3. Write down the large text listed inside the icon for the bus. In this case, it is "12". If the bus has any letters or hyphens (i.e. "04-05" or "N15"), include those.
<img width="59" alt="Screenshot 2023-07-18 at 3 42 49 PM" src="https://github.com/bwees/AggieSpiritWidget/assets/12686250/00277f34-6a7f-46f0-9247-dd50dea2cbf2">

4. Open the bus and look at the timetable.
5. You can choose up to 3 stops for your widget. Note the position from the left starting at 0 for each stop you want (look at the picture below for reference). The farthest column on the right CANNOT be used. It is covered with a yellow box in this example.

   <img width="542" alt="Screenshot 2023-07-18 at 3 41 26 PM" src="https://github.com/bwees/AggieSpiritWidget/assets/12686250/b4dea8cc-404d-4eae-9daa-4474c252fb75">

6. In this example, we are going to use Trigon, Munson, and Ashburn so our positions would be 0, 1, and 5
7. Repeat steps 1-6 in this section for up the 3 buses. You should have information like the table below.
   
| Bus | Stops   |
|-----|---------|
| 12  | 1, 3, 5 |
| N15 | 0, 1, 2 |
| 47-48  | 2, 3, 4 |

8. Finally for each bus put the bus number, a `|` character (a pipe, not an I or 1), then each stop positions with a comma `,`. Then put an `&` in between each bus
9. Based on the information in the example table in step 7, our configuration will look like `12|1,3,5&N15|0,1,2&47-48|2,3,4`
10. Yours will vary based on which buses and stops you chose. Include all hyphens and letters from Step 3.

*If you have any issues, please create an issue and include your configuration from Step 8 and the buses you are trying to create and I will try to help!*
