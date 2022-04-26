import { IonButton, IonContent, IonPage, useIonModal, IonModal  } from '@ionic/react';
import { create } from 'domain';
import { useState, useEffect } from 'react';
import './Name.css';

class User  {
    name: string;
    email: string;

    public constructor();
    public constructor(name: string, email: string);
    public constructor(...myarray: any[]){
        if (myarray.length === 2){
            // 2 parameter constructor
            this.name=myarray[0];
            this.email=myarray[1];
        } else{
            // parameterless constructor
            this.name="";
            this.email="";
        }
    }
}

interface ContainerProps { }

const Name: React.FC<ContainerProps> = () => {

    const [userdata, setUsername] = useState(new User());

    useEffect(()=>{
        // console.log('use effect');

        if (!window.indexedDB) {
            console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
            // break out of effect 
            return;
        }
        // name of the database **NOTE object store will have the same name as DB
        const dbName = "the_name";

        // delete db
        window.indexedDB.deleteDatabase(dbName);

        // var customerData:Array<any>= [
        //     {ssn: '444-44-4444',  name: "Bill", age: 35, email: "bill@company.com" },
        //     { ssn: '555-55-5555',  name: "Donna", age: 32, email: "donna@home.org" }
        // ];

    //    var  customerData =

 


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
            var objectStore = db.createObjectStore(dbName, { keyPath: "email" });
              // define what data items the objectStore will contain
              objectStore.createIndex("name", "name", { unique: false });
              objectStore.createIndex("email", "email", { unique: true });
            //   objectStore.createIndex("age", "age", { unique: false });

            objectStore.transaction.oncomplete= (event:any)=>{
                var customerObjectStore = db.transaction(dbName, "readwrite").objectStore(dbName);

                // params should be empty strings for user object in new db
                var test = new User("name", "email");

                customerObjectStore.add(test);
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

            objectStore.openCursor().onsuccess = (event:any) => {
                var cursor = event.target.result;
                if (cursor) {
                console.log("Email:  " + cursor.key + "\n Name: " + cursor.value.name);

                //   update DOM with username and email if not empty strings else load empty
                cursor.continue();
                }
                else {
                console.log("No more entries!");
                }

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
