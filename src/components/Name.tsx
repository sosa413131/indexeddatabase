import { IonButton, IonContent, IonPage, useIonModal, IonModal, IonInput, IonItem, IonLabel, IonCheckbox} from '@ionic/react';
import { create } from 'domain';
import { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
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
    const [username, setUsername] = useState(new User());
    const { control, handleSubmit } = useForm();

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
                    var email = cursor.key;
                    var name = cursor.value.name;
                console.log("Email:  " + cursor.key + "\n Name: " + cursor.value.name);

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


     var registerUser = (data:any)=>{
         console.log("submitted data: ", data);

    }

    if (username.name){
    return (
        <div className="container">  
            Hello, {username.name}
            Your email is {username.email}
        </div>
    );
    } else{
        return (
            <div className="container">  
            <div className='loginPrompt'><p>No username found, kindly fill out the form and provide user details</p></div>
                <form className="ion-padding" onSubmit={handleSubmit(registerUser)}>
                    <IonItem>
                        <IonLabel position="floating">Username</IonLabel>
                        <IonInput className='username'/>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="floating">Email</IonLabel>
                        <IonInput type="email" />
                        {/* <Controller
                            as={<IonInput type="email" />}
                            name="email"
                            control={control}
                            onChangeName="onIonChange"
                            /> */}
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
