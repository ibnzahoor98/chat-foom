import AuthUpperSection from "./AuthUpperSection";
import AuthButton from './AuthButton';
import AuthInput from './AuthInput';  
import FirebaseLocal from "../../FirebaseLocal";
import { doc, setDoc, getFirestore,  } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
 
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
function Register(){
    document.title = "Register - ChatFoom";
    let name:string = "";
    let email:string = "";
    let password:string = ""; 

    const handleInputValue = (i: any)=>{
        var obj = eval(i);
        console.log(obj);
        if (obj.type === "text")
        {
            name = obj.value;
        }
        else if (obj.type === "email")
        {
            email = obj.value;
        }
        else if (obj.type === "password")
        {
            password = obj.value;
        } 
        

    }
     const handleOnClick =  (btnType:string, btnRef:any)  =>{ 

        var message:any = document.getElementsByClassName("auth-message")[0];
        if (name == "")
        {
            message.innerHTML = `<i class="fa-solid fa-skull-crossbones red"></i> Please enter your name.`;
            setTimeout(()=>{
                message.innerHTML = "";
            }, 2000);

            message.style.color = "#CA000C";
        }
        else if (email === "")
        { 
            message.innerHTML = `<i class="fa-solid fa-skull-crossbones red"></i> Please enter your email address.`;
            setTimeout(()=>{
                message.innerHTML = "";
            }, 2000);
            message.style.color = "#CA000C";
        }else if (password === "")
        { 
            message.innerHTML = `<i class="fa-solid fa-skull-crossbones red"></i> Please enter your password.`;
            setTimeout(()=>{
                message.innerHTML = "";
            }, 2000);
            message.style.color = "#CA000C";
        } 
        else{
            btnRef.innerHTML = 
            `
            <div class="spinner-border spinner-border-sm text-light" role="status">
                <span class="sr-only">Loading...</span>
            </div>
            `
            const app = FirebaseLocal.initFirebase();
            const auth = getAuth(app);
            createUserWithEmailAndPassword(auth, email, password)
              .then((userCredential) => { 
                message.style.color = "#057811"; 
                btnRef.innerHTML = btnType;
                const user = userCredential.user; 
                localStorage.setItem("user", JSON.stringify(user));
                message.innerHTML = `<i class="fa-sharp fa-solid fa-thumbs-up green"></i>  Register successful!` ;
                
                addFirestoreData(name.trim(), email, password, message, userCredential);
               
                

                
              })
              .catch((error) => {  
                btnRef.innerHTML = 
                    `
                Register
                    `
                btnRef.innerHTML = btnType;
                const errorMessage = error.message; 
                message.innerHTML = `<i class="fa-sharp fa-solid fa-thumbs-up red"></i>  ${errorMessage}` ;
                setTimeout(()=>{
                    message.innerHTML = "";
                }, 2000);
                message.style.color = "#CA000C";

              });

        }

        

    }

   

    return  (
       
        <div className="auth-container register-container shadow-lg">
            <div className="auth-inner-container register-inner-container"> 

            <AuthUpperSection></AuthUpperSection>  
            <div className="auth-bottom">
                <h2 className="auth-title">Register</h2>
                <AuthInput  getInputValue={handleInputValue} placeholder='Name' inputType="text"></AuthInput>  
                <AuthInput  getInputValue={handleInputValue} placeholder='Email address' inputType="email"></AuthInput>  
                <AuthInput getInputValue={handleInputValue} placeholder='Password' inputType="password"></AuthInput>
                <p className="auth-message"></p> 
                <AuthButton onClick={handleOnClick} color="auth-button-brand-1" title="Register" ></AuthButton> 
            </div>

            </div>  
        </div>
            
          
           
    )
}

async function addFirestoreData(name:any, email:any, password:any, message:any
    , userCredential:any){
 
          
 
    const app = FirebaseLocal.initFirebase();;
    const firestore = getFirestore(app); 
    var data = 
    {
        name: name,
        email: email,
        password: password,
        avatar:"https://firebasestorage.googleapis.com/v0/b/chat-foom.appspot.com/o/avatars%2Favatar-11.png?alt=media&token=2f68d9e2-6b8f-4d48-8f1c-f30160c0a6c4"
        

    }
    const cityRef = doc(firestore, 'chat-foom', 'users', userCredential.user.uid, "profile");
    await setDoc(cityRef, data).then(
        ()=>{ 
            window.open("/chat", "_self"); 
    }).catch((e)=>{
        message.innerHTML = `<i class="fa-sharp fa-solid fa-thumbs-up"></i>  ${e.message}` ; 

    })
}

export default Register;