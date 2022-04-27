import { IonButton, IonContent, IonPage, useIonModal, IonModal, IonInput, IonItem, IonLabel, IonCheckbox} from '@ionic/react';
import { create } from 'domain';
import { useState, useEffect, useCallback } from 'react';
// import { Controller, useForm, UseControllerProps } from 'react-hook-form';
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

export type FormValues = {
    name: string;
    email: number;
  };
interface ContainerProps { }

const Name: React.FC<ContainerProps> = () => {
    const [nameField, setNameField] = useState<string>("");
    const [emailField, setEmailField] = useState<string>("");
    const [username, setUsername] = useState(new User());

    // name of the database **NOTE object store will have the same name as DB
    const dbName = "the_name";

    useEffect(()=>{

        if (!window.indexedDB) {
            console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
            // break out of effect 
            return;
        }

        // delete db
        window.indexedDB.deleteDatabase(dbName);

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
                    var email = cursor.key;
                    var name = cursor.value.name;
                console.log("Email:  " + cursor.key + "\nName: " + cursor.value.name);

                //   update DOM with username and email if not empty strings
                if(name){
                    setUsername(name);
                }  //else form with input fields will capture user info

                cursor.continue();
                }
                else {
                console.log("No more entries!");
                }

            }
        }


    },[]);


     var registerUser = (event:any)=>{
         event.preventDefault();
        //  exclamations to let typescript know values cannot be null
         var newName = document.querySelector(".username")?.getAttribute("value")!;
         var newEmail = document.querySelector(".email")?.getAttribute("value")!;
         console.log("submitted data: ", {name:newName, email:newEmail});

         setUsername(new User(newName,newEmail ));

        // var request = window.indexedDB.open(dbName, 1);

        // request.onsuccess = (event:any) => {
        //      // Do something with the request.result!
        //      console.log("success!")
        //      var db = event.target.result;
        //      var transaction = db.transaction([dbName]);
        //      var objectStore = transaction.objectStore(dbName);

        //      objectStore.openCursor().onsuccess = (event:any) => {
        //         var cursor = event.target.result;
        //         if (cursor) {
        //             var email = cursor.key;
        //             var name = cursor.value.name;
        //         console.log("Email:  " + cursor.key + "\nName: " + cursor.value.name);

        //         //   update DOM with username and email if not empty strings
        //         if(name===""){
        //             setUsername(new User(newName, newEmail));

        //         }  //else form with input fields will capture user info

        //         cursor.continue();
        //         }
        //         else {
        //         console.log("No more entries!");
        //         }
        //     }

        // }
    };

    if (username.name){
    return (
        <div className="container">  
            <p>Hello, {username.name}</p>
            <p>Your email is {username.email}</p>
        </div>
    );
    } else{
        return (
            <div className="container">  
            <div className='loginPrompt'><p>No username found, kindly fill out the form and provide user details</p></div>
                <form className="ion-padding" onSubmit={registerUser}>
                    <IonItem>
                        <IonLabel position="floating">Username</IonLabel>
                        <IonInput value={nameField}  onIonChange={e => setNameField(e.detail.value!)} className='username'/>
                        {/* <Controller
                            as={<IonInput/>}
                            name="email"
                            control={control}
                            onChangeName="onIonChange"
                            /> */}
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Email</IonLabel>
                        <IonInput type="email" value={emailField}  onIonChange={e => setEmailField(e.detail.value!)} className='email' />
                    </IonItem>
                    <IonButton className="ion-margin-top" type="submit" expand="block">
                        Register
                    </IonButton>
                </form>
            </div>
        );
    }

};

export default Name;
