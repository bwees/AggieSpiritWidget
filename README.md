# Aggie Spirit iOS Widget


<img width="256" alt="Screenshot 2023-07-18 at 3 33 59 PM" src="https://github.com/bwees/AggieSpiritWidget/assets/12686250/5bc4fd82-db89-4a51-89c5-8fcbf6b62ce0">

#### ⚠️⚠️ If the widget does not work, please update the widget using the following [instructions](https://github.com/bwees/AggieSpiritWidget/issues/1#issuecomment-1671937635)

# Installation Steps:
1. Install the [Scriptable App](https://scriptable.app/)
2. Copy the code found [here](https://raw.githubusercontent.com/bwees/AggieSpiritWidget/main/main.js)
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
<img width="333" alt="Screenshot 2023-08-02 at 3 24 17 PM" src="https://github.com/bwees/AggieSpiritWidget/assets/12686250/976d40c7-713e-42c8-8e68-77b671d9e9c1">


4. Open the bus and look at the timetable (click "Bus Times" on the top menu, then select bus)
5. Click the direction of travel you would like to view by toggling the switch. Write down if the switch is to the left or right. In this example, you would write down "Right"

<img width="521" alt="Screenshot 2023-08-02 at 3 29 15 PM" src="https://github.com/bwees/AggieSpiritWidget/assets/12686250/977430bc-17fa-46c2-bcc7-05755d3453a2">


6. You can choose up to 3 stops for your widget. Note the position from the left starting at 0 for each stop you want (look at the picture below for reference).

<img width="1331" alt="Screenshot 2023-08-02 at 3 29 26 PM" src="https://github.com/bwees/AggieSpiritWidget/assets/12686250/7e625837-3c0f-48a6-87ed-6de76799fb5b">

7. In this example, we are going to use Trigon, Munson, and Ashburn so our positions would be 0, 1, and 5
8. Repeat steps 1-6 in this section for up to 3 buses. You should have information like the table below. If you would like to switch to the other schedule (L or R) for a single stop, you can add a L or R to the end of the stop position number.
   
| Bus | Stops   | Switch Direction |
|-----|---------|------------------|
| 12  | 1, 2    | Left             |
| 04  | 0, 1, 2 | Right            |
| 03  | 2, 3, 4 | Left             |

9. Finally for each bus put:
   1. The bus number
   2. a comma `,`
   3. an `L` or `R` depending on whether your switch was to the left or right
   4. a `|` character (a pipe, not an I or 1)
   5. each stop's position with a comma `,`. 
   6. an `&` in between each bus
   7. Repeat substeps 1-6 for each bus
9. Based on the information in the example table in step 7, our configuration will look like `12,L|1,2&04,R|0,1,2&03,L|2,3,4`
10. Yours will vary based on which buses and stops you chose. Include all hyphens and letters from Step 3.

*If you have any issues, please create an issue and include your configuration from Step 8 and the buses you are trying to create and I will try to help!*
