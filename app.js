// Map Import

var map = L.map('map').setView([41.344, -6.961], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);


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


                const studiesList = [...new Set(results.data.map(item => item.individual_id))];
                    studiesList.forEach( individual_id => {

                        const option = document.createElement("option")
                        option.value = individual_id;
                        option.text = individual_id;

                        studyDropdown.appendChild(option);
                    });

               

        

                const filteredData = results.data.filter( item => item.individual_id === query) 
                    
                

                    if (filteredData.length > 0) {
                        filteredData.forEach(item => {
                        if (item.location_lat && item.location_long) {
                            const lat = parseFloat(item.location_lat);
                            const lon = parseFloat(item.location_long);

                            const marker = L.marker([lat, lon]).addTo(map);
                            marker.bindPopup(`<b>${item.name}</b><br>Some additional info about the animal.`);
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
        }

            
         
        

      

    
    
    //  ----Event Listeners 

     searchButton.addEventListener("click", ()=>{
        const selectedStudy = studyDropdown.value;

        if(selectedStudy){
            animalDataSearch(selectedStudy);
        } else {
            console.log("Please select a study");
        }


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
            


