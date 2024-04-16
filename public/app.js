let h3=document.querySelector('#quote-content h3');
let h4=document.querySelector('#quote-content h4');
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
              toggleMenu()
              window.addEventListener('scroll', stopScrolling);
          }
    function rtogle(){
            let blur=document.querySelector('.overlay');
              blur.classList.remove('showoverlay');
              let popups=document.querySelector('.popup');
              popups.classList.remove('showpopup');
              window.removeEventListener('scroll', stopScrolling);
          }

          function stopScrolling(e) {
            e.preventDefault();
            window.scrollTo(0, 0);
          }

          document.querySelector(".vip").addEventListener("click",togle);
          document.querySelector(".close").addEventListener("click",rtogle);

          function nextchoose(){
          let cours=document.querySelector("#course");
          document.querySelector("#department").innerHTML="";
            fetch(`/data/${cours.value}`)
                  .then(response => response.json())
                  .then(data => {
                    // Use the variable received from the server
                    console.log(data.data); // Output: Hello from the server!
                    let depts=[...data.data.dept];
                    let newselect=document.createElement('option');
                    newselect.innerHTML="Select your Department";
                    document.querySelector('#department').options.add(newselect);
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
        

        function nextcode(){
          let dept=document.querySelector("#department");
          document.querySelector("#code").innerHTML="";
            console.log(dept.value);
            fetch(`/syllabuses/${dept.value}`)
                  .then(response => response.json())
                  .then(data => {
                    // Use the variable received from the server
                    console.log(data.data.syllabus); // Output: Hello from the server!
                    let syllabus=[...data.data];
                    let newselect=document.createElement('option');
                    newselect.innerHTML="Select your Subject";
                    document.querySelector('#code').options.add(newselect);
                    for(s of syllabus){
                let newoption=document.createElement('option');
                newoption.value=s._id;
                newoption.innerHTML=`${s.code},${s.subjectname}`;
                document.querySelector('#code').options.add(newoption);
            }
                  })
                  .catch(error => {
                    console.error('Error:', error);
                  });    
        }
// navbar


    
function closeSuccessMessage() {
  var successContainer = document.getElementById("success-Container");
  successContainer.style.display = "none"; // Hide the success message container
  document.querySelector('.extra-space').removeAttribute("class");
}
          
 //for validation      
 function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

document.getElementById('emailvalid').addEventListener('submit', function(event) {
  const emailInput = document.getElementById('email');
  const email = emailInput.value.trim();

  if (!validateEmail(email)) {
    alert('Please enter a valid email address.');
    event.preventDefault(); // Prevent form submission
  }
});
          
function toggleMenu() {
  var navbarLinks = document.getElementById("navbarLinks");
  if (navbarLinks.style.display === "block") {
      navbarLinks.style.display = "none";
  } else {
      navbarLinks.style.display = "block";
  }
}
