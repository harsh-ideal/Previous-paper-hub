document.querySelector("#course").addEventListener("change",courses);
document.querySelector("#syllabuscourse").addEventListener("change",courses);

          

          function courses(){
            let course=document.querySelector("course");
            let newcourse=document.querySelector("newcourse");
            console.log("ho rha hai");
            if(course.value=='other'){
              newcourse.removeAttribute('hidden');
            }
            }


           