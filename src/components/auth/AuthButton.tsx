import '../../App.css'; 
interface Props{
    color: string, 
    title: string,
    onClick: (btnType:string, btnRef:any) => void, 
}

 

function AuthButton({title, color, onClick}: Props){

    const sendData = ()=>{
        const authButton = document.getElementsByClassName("auth-button")[0];
       
        onClick(title, authButton)
    }

    return  (

        <button  onClick={sendData} className={"auth-button "+ color} >{title}</button>

    )
}

export default AuthButton;