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
    }