 let apiResponse = null; 

        let routes = {};
        let userSchedules = JSON.parse(localStorage.getItem('stmLines')) || [];


        const greenLine = document.getElementById('green');

        
        const scheduleNumberInput = document.getElementById('schedule-number');
        const addScheduleButton = document.getElementById('add-schedule');
        const schedulesContainer = document.getElementById('schedules-container');
        const checkStatusButton = document.getElementById('check-status');
        


        //helper functions to display all schedules the user has saved and/or inputted. 
        function displayUserSchedules() {
            schedulesContainer.innerHTML = '';
            
            if (userSchedules.length === 0) {
                schedulesContainer.innerHTML = '<p>No lines saved yet. Add some above!</p>';
                return;
            }
            
            userSchedules.forEach((line, index) => {    
                const lineItem = document.createElement('div');
                lineItem.className = 'line-item';
                lineItem.innerHTML = `
                    <div>
                        <strong>BUS</strong>: ${line.number}

                         <span class="status">${line.status || 'Unknown'}</span>
                    </div>
                    <button class="remove-button" data-index="${index}">Remove</button>
                `;
                schedulesContainer.appendChild(lineItem);
            });
            
            document.querySelectorAll('.remove-button').forEach(button => {
                button.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    userSchedules.splice(index, 1);
                    saveUserSchedules();
                    displayUserSchedules();
                });
            });

        }


        function saveUserSchedules() {
            localStorage.setItem('stmLines', JSON.stringify(userSchedules));
        }
        
        //helper function to check validity of line.
        function isValidStop(userInput) {
            return userInput in routes;
        }
       
    //adding a schedule involves edge case checking and refershing user view.
        addScheduleButton.addEventListener('click', function() {
            const scheduleNumber = scheduleNumberInput.value.trim();
            
            if (!scheduleNumber) {
                alert('Please enter a line number');
                return;
            }else{
            // **prevent duplicates** 
                const exists = userSchedules.some(ls => ls.number === scheduleNumber
                );
                    if (exists) {
                        return alert(`You’ve already added ${scheduleNumber}`);
                    }
                if(isValidStop(scheduleNumber)){
                    userSchedules.push({
                    number: scheduleNumber,
                    status: 'Not checked yet'
                    });
                }
            }
            
            saveUserSchedules();
            displayUserSchedules();
            scheduleNumberInput.value = '';
        });

  // Function to call the backend endpoint and receive its response.
  async function refreshSTMData() {
  try {
    const response = await fetch('/api/lines');
    if (!response.ok) {
      console.error('HTTP error:', response.status);
      return;
    }
    const data = await response.json();
    apiResponse = data; //stm response officially registered each time this function is called. we then parse it to store into local all instances of route
    //numbers, followed by their mapping to the status description. All stored within routes hashmap. 


    routes = {};
    apiResponse.alerts.forEach(alert => {
        // find the route number
        const routeEnt = (alert.informed_entities || [])
          .find(e => e.route_short_name != null);
        if (!routeEnt) return;

        const route = routeEnt.route_short_name;

        // find the English description
        const descEnt = (alert.description_texts || [])
          .find(d => d.language === 'en');
        const status = descEnt ? descEnt.text : '';

        // store it
        routes[route] = status;
      });

    console.log("STM API Data:", data);
    console.log("stops: ", routes)

    console.log(routes['161']);

    displayMetroLines();
  } catch (error) {
    console.error("Error fetching STM API data:", error);
  }
}

function displayMetroLines() {
  const metroMap = {
    green:  "1",
    orange: "2",
    yellow: "4",
    blue:   "5"
  };

  Object.entries(metroMap).forEach(([colorId, routeNum]) => {
    const card = document.getElementById(colorId);
    if (!card) return;  // in case the div is missing

    const statusText = routes[routeNum] || 'No data';

    // find (or create) a .status element inside the card
    let statusEl = card.querySelector('.status');
    if (!statusEl) {
      statusEl = document.createElement('span');
      statusEl.className = 'status';
      card.appendChild(statusEl);
    }
    statusEl.textContent = statusText;
  });
}


function checkStatus() {
    refreshSTMData();
  userSchedules.forEach(line => {
    // grab the latest English status text, or fall back
    line.status = routes[line.number] || 'No update';
  });
  saveUserSchedules();
  displayUserSchedules();
}


checkStatusButton.addEventListener("click", checkStatus);

refreshSTMData(); //initalize first.
displayUserSchedules();