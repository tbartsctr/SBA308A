// Map Import

var map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);


  // Animal Data Import
  
  const searchBar = document.getElementsByClassName("searchBarDiv")[0];
  const searchButton = document.getElementById("searchBtn");



  async function animalDataSearch(query){
        try{
        const token = "9d5f016f-cbbe-4976-a448-5063abff6aa7";
        const url = `https://www.movebank.org/movebank/service/direct-read?entity_type=event&study_id=312057662&sensor_type=gps&api-token=${token}`
        const response = await fetch(url);
        
        const text = await response.text();
        console.log("Response Text:", text);

        const csv = Papa.parse(text, { header: true, skipEmptyLines: true });

            const data = await response.text();
                console.log("Fetched Data", data);
            
                if (Array.isArray(data)){
                    const filteredData = data.filter(item => {

                        return item.study_name && item.study_name.toLowerCase().includes(query.toLowerCase());
                    });



                    };


                    if (filteredData.length > 0) {
                        filteredData.forEach(item => {
                        if (item.latitude && item.longitude) {
                            const lat = item.latitude;
                            const lon = item.longitude;

                            const marker = L.marker([lat, lon]).addTo(map);
                            marker.bindPopup(`<b>${item.name}</b><br>Some additional info about the animal.`);
                        } else {
                            console.log("No data available");
                        }
                    })
                }

            }
            catch (error){
            console.error("Error fetching all studies", error);

              }

     } 

     animalDataSearch();
    

     searchButton.addEventListener("click", ()=>{
        const query = searchBar.value.trim();

        if(query){
            animalDataSearch(query);
        } else {
            console.log("Please enter a search term");
        }


     });

     searchBar.addEventListener("keyup", (event)=> {
        if (event.key === "Enter"){
            const query = searchBar.value.trim();
            if (query) {
                animalDataSearch(query);
            }
        }
     })

            

  

