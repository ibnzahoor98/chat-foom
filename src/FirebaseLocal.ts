import { initializeApp } from "firebase/app"; 

class FirebaseLocal{

    static initFirebase(){

        const firebaseConfig = {
            apiKey: "AIzaSyBw4wwvGQYK2U-K7W5AoE9h3HOS4iFVoMM",
            authDomain: "chat-foom.firebaseapp.com",
            projectId: "chat-foom",
            storageBucket: "chat-foom.appspot.com",
            messagingSenderId: "569345988017",
            appId: "1:569345988017:web:5d0904dc52b984c09cd990",
            measurementId: "G-RL4NWMD7G8"
          };
          
        return initializeApp(firebaseConfig); 
   
    }
}

export default FirebaseLocal;