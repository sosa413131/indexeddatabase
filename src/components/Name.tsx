import { IonButton, IonContent, IonPage, useIonModal, IonModal  } from '@ionic/react';
import { create } from 'domain';
import { useState, useEffect } from 'react';
import './Name.css';

interface ContainerProps { }

const Name: React.FC<ContainerProps> = () => {
    const [username, setUsername] = useState(null);
    
    useEffect(()=>{

        if (!window.indexedDB) {
            console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
            // break out of effect 
            return;
        }
        // name of the database **NOTE object store will have the same name as DB
        const dbName = "the_name";

        // delete db
        // window.indexedDB.deleteDatabase(dbName)


        // darray to be written to db
        var customerData:Array<any>= [
            {ssn: '444-44-4444',  name: "Bill", age: 35, email: "bill@company.com" },
            { ssn: '555-55-5555',  name: "Donna", age: 32, email: "donna@home.org" }
        ];


        // handle to database -- will trigger upgrade
        var request = window.indexedDB.open(dbName, 0+1);

        request.onerror = (event:any) => {
            // handle errors
            console.log("Database error: " + event.target.errorCode);

        };

        request.onupgradeneeded = (event:any) => {
            var db = event.target.result;
            if(!objectStoreAlreadyExists(db.objectStoreNames, dbName)){
                createDatabase(event);
            };
        };

        request.onsuccess = (event:any) => {
            event.target.result.close();
        };

        function createDatabase(event: any){
            console.log("creating db");
            var db = event.target.result;
            var objectStore = db.createObjectStore(dbName, { keyPath: "ssn" });
              // define what data items the objectStore will contain
            objectStore.createIndex("name", "name", { unique: false });
            objectStore.createIndex("email", "email", { unique: true });
            objectStore.createIndex("age", "age", { unique: false });

            objectStore.transaction.oncomplete= (event:any)=>{
                var customerObjectStore = db.transaction(dbName, "readwrite").objectStore(dbName);
                customerData.forEach(function(customer) {
                    customerObjectStore.add(customer);
                });
            };
        };

        function objectStoreAlreadyExists(objectStoreNamesArray:Array<string>, nameToConfirm:string) : boolean{
            for (var i=0; i<objectStoreNamesArray.length;i++ ){
                if(objectStoreNamesArray[i]===nameToConfirm){
                    return true;
                }
            }
            return (false);
        }

        // new request to obtain name data
        var request = window.indexedDB.open(dbName, 1);
        request.onerror = (event:any) => {
              // handle errors
              console.log("Database error: " + event.target.errorCode);
          };

        request.onsuccess = (event:any) => {
        // Do something with the request.result!
        var db = event.target.result;
        var transaction = db.transaction([dbName]);
        var objectStore = transaction.objectStore(dbName);
        request = objectStore.get("444-44-4444");

        request.onsuccess=(event:any)=>{
            console.log("Bill: ", request.result);
        }
    }


    },[]);


  return (
    <div className="container">  
    Test
    </div>
  );
};

export default Name;
