function table(courseid , deptid){
    fetch(`/data/${courseid}`)
          .then(response => response.json())
          .then(data => {
            // Use the variable received from the server
            console.log(data.data); // Output: Hello from the server!
            let depts=[...data.data.dept];
            let dep='';
            let cour= data;
            for(dept of depts){
        if(deptid==dept.id){
            dep=dept.deptname;
            break;
        }
    }
    return [cour,dept];
          })
          .catch(error => {
            console.error('Error:', error);
          });
        }


        
function sortTable(columnIndex) {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("myTable");
    switching = true;

    while (switching) {
        switching = false;
        rows = table.getElementsByTagName("tr");
        
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("td")[columnIndex];
            y = rows[i + 1].getElementsByTagName("td")[columnIndex];
            
            if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                shouldSwitch = true;
                break;
            }
        }
        
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}