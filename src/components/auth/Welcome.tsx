import AuthUpperSection from "./AuthUpperSection";
import AuthButton from './AuthButton'; 
import { useNavigate } from "react-router-dom";
import welcome from "../../assets/images/welcome.webp"
 
function Welcome(){ 
    document.title = "Welcome - ChatFoom";
    const navigate = useNavigate();
     
    const handleOnClick = (btnType:string)=>{
        
        navigate("/"+btnType.toLowerCase()); 
      

    }
     
   

    return  (
       
        <div className="auth-container shadow-lg">
            <div className="auth-inner-container">  
            <AuthUpperSection></AuthUpperSection>  
            <br/> 
            <p className="welcome-message">Chat foom: Where boundless connections unite stories and ideas across the globe.</p>
            {/* <img className="img-fluid welcome-img" src={welcome}></img> */}
            <div className="auth-bottom">
            <AuthButton  onClick={handleOnClick} color="auth-button-brand-5"  title="Login" ></AuthButton> 
            <AuthButton  onClick={handleOnClick} color="auth-button-brand-1"  title="Register" ></AuthButton> 
          
            </div>
            </div>  
        </div>
            
          
           
    )
}

export default Welcome;