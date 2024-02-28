
let h3=document.querySelector('#quote-content h3');
let h4=document.querySelector('#quote-content h4');
// h1.innerHTML="harsh";
fetch("https://type.fit/api/quotes")
            .then(function(response) {
              return response.json();
            })
            .then(function(data) {
              h3.innerHTML=data[Math.floor(Math.random()*15)].text;
              h4.innerHTML+=data[Math.floor(Math.random()*15)].author;
            }); 

            function togle(){
              let blur=document.querySelector('.overlay');
              blur.classList.add('showoverlay');
              let popups=document.querySelector('.popup');
              popups.classList.add('showpopup');
          }
          function rtogle(){
            let blur=document.querySelector('.overlay');
              blur.classList.remove('showoverlay');
              let popups=document.querySelector('.popup');
              popups.classList.remove('showpopup');
          }

          document.querySelector(".vip").addEventListener("click",togle);
          document.querySelector(".close").addEventListener("click",rtogle);

          function nextchoose(){
            console.log("ho rha hai");
          let cours=document.querySelector("#course");
          document.querySelector("#department").innerHTML="";
            console.log(cours.value);
            fetch(`/data/${cours.value}`)
                  .then(response => response.json())
                  .then(data => {
                    // Use the variable received from the server
                    console.log(data.data); // Output: Hello from the server!
                    let depts=[...data.data.dept];
                    for(dept of depts){
                let newoption=document.createElement('option');
                newoption.value=dept._id;
                newoption.innerHTML=dept.deptname;
                document.querySelector('#department').options.add(newoption);
            }
                  })
                  .catch(error => {
                    console.error('Error:', error);
                  });    
        }
        
    
          
           
          
