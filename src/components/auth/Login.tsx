import AuthUpperSection from "./AuthUpperSection";
import AuthButton from './AuthButton';
import AuthInput from './AuthInput';
import FirebaseLocal from "../../FirebaseLocal";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
   

function Login(){
    document.title = "Login - ChatFoom";
    let email:string = "";
    let password:string = ""; 

    const handleInputValue = (i: any)=>{
        var obj = eval(i);
        if (obj.type === "email")
        {
            email = obj.value;
        }
        else if (obj.type === "password")
        {
            password = obj.value;
        } 
        

    }
    const handleOnClick = (btnType:string, btnRef:any)=>{
        
    var message:any = document.getElementsByClassName("auth-message")[0];

        if (email === "")
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
        }else{ 
            btnRef.innerHTML = 
            `
            <div class="spinner-border spinner-border-sm text-light" role="status">
                <span class="sr-only">Loading...</span>
            </div>
            `
 
            const app = FirebaseLocal.initFirebase();
            const auth = getAuth(app); 
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => { 
               
                message.style.color = "#057811"; 
                btnRef.innerHTML = btnType;
                localStorage.setItem("user", JSON.stringify(userCredential.user));
                message.innerHTML = `<i class="fa-sharp fa-solid fa-thumbs-up green"></i>  Login successful!` ;
                setTimeout(() => {
                    
                    window.open("/chat", "_self"); 
      

                }, 1000);
             
            })
            .catch((error) => {  
                btnRef.innerHTML = 
                    `
                Login
                    `
                btnRef.innerHTML = btnType;
                const errorMessage = error.message;
                message.innerHTML = `<i class="fa-solid fa-skull-crossbones red"></i> ${errorMessage}`;
                setTimeout(()=>{
                    message.innerHTML = "";
                }, 2000);
                message.style.color = "#CA000C";
            });
        }

        

    }

   

    return  (
       
        <div className="auth-container login-container shadow-lg">
            <div className="auth-inner-container login-inner-container"> 

            <AuthUpperSection></AuthUpperSection>  
            
            <div className="auth-bottom">
                <h2 className="auth-title">Login</h2>
                <AuthInput  getInputValue={handleInputValue} placeholder='Email address' inputType="email"></AuthInput>  
                <AuthInput getInputValue={handleInputValue} placeholder='Password' inputType="password"></AuthInput>
                <p className="auth-message"></p> 
                <AuthButton onClick={handleOnClick} color="auth-button-brand-1" title="Login" ></AuthButton> 
            </div>

            </div>  
        </div>
            
          
           
    )
}

export default Login;