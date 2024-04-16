document.querySelector('.course').addEventListener('change',course);

function course(){
    console.log("ho rha hai");
  let cours=document.querySelector(".course");
  let newcourse=document.querySelector("#newcourse");
  document.querySelector("#department").innerHTML="";
  if(cours.value==='other'){
    newcourse.removeAttribute('hidden');
    document.querySelector("#newdept").removeAttribute('hidden');
    document.querySelector("#department").value=""
    document.querySelector("#department").setAttribute('disabled',true);

  }else{
    console.log(typeof(cours.value));
    newcourse.setAttribute('hidden',true);
    document.querySelector("#newdept").setAttribute('hidden',true);
    document.querySelector("#department").removeAttribute('disabled');
    console.log(cours.value);
    fetch(`/data/${cours.value}`)
          .then(response => response.json())
          .then(data => {
            // Use the variable received from the server
            console.log(data.data); // Output: Hello from the server!
            let depts=[...data.data.dept];
            let nwoption=document.createElement('option');
          nwoption.innerHTML="Select Your Department";
          document.querySelector('#department').options.add(nwoption);
            for(dept of depts){
        let newoption=document.createElement('option');
        newoption.value=dept._id;
        newoption.innerHTML=dept.deptname;
        document.querySelector('#department').options.add(newoption);
    }
    let newoption=document.createElement('option');
        newoption.value="other";
        newoption.innerHTML="Other";
        document.querySelector('#department').options.add(newoption);
          })
          .catch(error => {
            console.error('Error:', error);
          });

          
    
}
}

    function depart(){
        if(document.querySelector("#department").value=='other'){
            document.querySelector("#newdept").removeAttribute('hidden');
        }
        else{
          document.querySelector("#newdept").setAttribute('hidden',true);
        }
    }



    function scourse(){
      console.log("ho rha hai");
    let cours=document.querySelector(".scourse");
    let newcourse=document.querySelector("#snewcourse");
    document.querySelector("#sdepartment").innerHTML="";
    if(cours.value==='other'){
      newcourse.removeAttribute('hidden');
      document.querySelector("#snewdept").removeAttribute('hidden');
      document.querySelector("#sdepartment").value=""
      document.querySelector("#sdepartment").setAttribute('disabled',true);
  
    }else{
      console.log(typeof(cours.value));
      newcourse.setAttribute('hidden',true);
      document.querySelector("#snewdept").setAttribute('hidden',true);
      document.querySelector("#sdepartment").removeAttribute('disabled');
      fetch(`/data/${cours.value}`)
            .then(response => response.json())
            .then(data => {
              // Use the variable received from the server
              console.log(data.data); // Output: Hello from the server!
              let depts=[...data.data.dept];
              let nwoption=document.createElement('option');
          nwoption.innerHTML="Select Your Department";
          document.querySelector('#sdepartment').options.add(nwoption);
              for(dept of depts){
          let newoption=document.createElement('option');
          newoption.value=dept._id;
          newoption.innerHTML=dept.deptname;
          document.querySelector('#sdepartment').options.add(newoption);
      }
      let newoption=document.createElement('option');
          newoption.value="other";
          newoption.innerHTML="Other";
          document.querySelector('#sdepartment').options.add(newoption);
            })
            .catch(error => {
              console.error('Error:', error);
            });
          }
        }


        function sdepart(){
          if(document.querySelector("#sdepartment").value=='other'){
              document.querySelector("#snewdept").removeAttribute('hidden');
          }
          else{
            document.querySelector("#snewdept").setAttribute('hidden',true);
          }
      }


      document.querySelector('.scourse').addEventListener('change',scourse);


    // For Search Page

    function filterOptions(event) {
      const input = event.target.value.toLowerCase();
      const dropdown = document.getElementById('searchSelectDropdown');
      const options = dropdown.getElementsByClassName('search-select-option');
      
      for (let i = 0; i < options.length; i++) {
          const option = options[i];
          if (option.textContent.toLowerCase().indexOf(input) > -1) {
              option.style.display = '';
          } else {
              option.style.display = 'none';
          }
      }

      dropdown.classList.add('show');
  }

  function selectOption(option) {
      let arr=option.textContent.trim().split(',');
      const input = document.querySelector('.search-select-input');
      input.value = arr[0];
      document.querySelector('#real-paper').value=arr[1];
      document.getElementById('searchSelectDropdown').classList.remove('show');
  }

 
  
  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('syllabus').addEventListener('input', function() {
        var inputText = this.value.trim();
        var secondSelect = document.getElementById('secondSelect');
        var options = secondSelect.getElementsByTagName('option');
        var suggestedOptions = document.getElementById('suggestedOptions');

        // Clear previous suggestions
        suggestedOptions.innerHTML = '';

        // Show options that match the input text
        for (var i = 0; i < options.length; i++) {
            var option = options[i];
            if (option.textContent.toLowerCase().indexOf(inputText.toLowerCase()) !== -1) {
                var optionClone = option.cloneNode(true);
                suggestedOptions.appendChild(optionClone);
            }
        }
    });
});

function fetchData() {
    var secondSelect = document.getElementById('secondSelect');
    var selectedOption = document.getElementById('firstSelect').value;

    // Clear previous options
    secondSelect.innerHTML = '';

    // Simulate fetching data from the server based on the selected option
    fetch(`/syllabuses/${dept.value}`)
        .then(response => response.json())
        .then(data => {
            data.forEach(s => {
                var optionElement = document.createElement('option');
                optionElement.value = s._id;
                optionElement.textContent = (`${s.code}${s.subjectname}`);
                secondSelect.appendChild(optionElement);
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}
