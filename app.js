// Map Import

var map = L.map('map').setView([41.344, -6.961], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  let markers = [];


  // Animal Data Import
  
  const studyDropdown = document.getElementById("studyDropdown");
  const searchButton = document.getElementById("searchBtn");



  async function animalDataSearch(query){
        try{
        const token = "9d5f016f-cbbe-4976-a448-5063abff6aa7";
        const url = `https://www.movebank.org/movebank/service/direct-read?entity_type=event&study_id=312057662&sensor_type=gps&api-token=${token}`
        const response = await fetch(url);

        
        
        const text = await response.text();
        console.log("Response Text:", text);

        Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                console.log("Parsed CSV Data:", results.data);

                // -----push studies to dropdown menu-----

                const studiesList = [...new Set(results.data.map(item => item.individual_id))];
                    studiesList.forEach( individual_id => {

                        const option = document.createElement("option")
                        option.value = individual_id;
                        option.text = individual_id;

                        studyDropdown.appendChild(option);
                    });

               

        // -------push location data to map------

                const filteredData = results.data.filter( item => item.individual_id === query) 
                    
                

                    if (filteredData.length > 0) {
                        filteredData.forEach(item => {
                        if (item.location_lat && item.location_long) {
                            const lat = parseFloat(item.location_lat);
                            const lon = parseFloat(item.location_long);
                            const tag = parseFloat(item.tag_id);
                            const timestamp = parseFloat(item.timestamp);

                            const marker = L.marker([lat, lon]).addTo(map);
                            

                            const popupContent = 
                            `<b>Individual ID:</b> ${item.individual_id} <br>
                            <b>Tag ID:</b> ${tag} <br>
                            <b>Timestamp:</b> ${timestamp}`

                            marker.bindPopup(popupContent);

                                    markers.push(marker);
                        } else {
                            console.log("No data available");
                        }
                        });
                    } else {
                        console.log("No studies found matching the query.");

                    }

            }

        });

                    
        } catch (error){
            console.error("Error fetching all studies", error);
            
                          }
        };
// -----------Function for POST new data (ONLY AN EXAMPLE, I DONT BELIEVE THESE STUDIES HAVE DATA EDITING EASILY AVAILIBLE)

        function postNewData(data){
            fetch(`https://www.movebank.org/movebank/service/direct-read?entity_type=event&study_id=312057662&sensor_type=gps&api-token=${token}`,{
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
            'Authorization': `Bearer ${your_api_token}`
        },
        body: JSON.stringify(data) 
                
            })

            .then(response => response.json())
            .then(data => {
                console.log("New data added", data);
            })
            
            .catch(error => {
                console.error("Error adding new data:", error);
            });
        }


        










        // -----Clear Markers-----
         
   function clearPreviousMarker(markers){

        for (let i = 0; i < markers.length; i++) {
                markers[i].remove();
        }

   }     

      

    
    
    //  ----Event Listeners 

     searchButton.addEventListener("click", ()=>{
        const selectedStudy = studyDropdown.value;

        if(selectedStudy){
            animalDataSearch(selectedStudy);
        } else {
            console.log("Please select a study");
        }
            clearPreviousMarker(markers);

     });

     studyDropdown.addEventListener("keyup", (event)=> {
        if (event.key === "Enter"){
            const query = studyDropdown.value
            if (query) {
                animalDataSearch(query);
            }
        }
     })

     
     animalDataSearch();
            


