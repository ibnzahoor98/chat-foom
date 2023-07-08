import '../../App.css'; 

interface Props{
    placeholder: string,
    inputType: string,
    getInputValue: (value: object) => void;
}

function AuthInput({placeholder, inputType, getInputValue}: Props){

    return  (

        <input onChange={(e) => getInputValue(
            {
                "value":e.target.value,
                "type": inputType
            }
            )} className="auth-input" type={inputType} placeholder={placeholder}/>

    )
}

export default AuthInput;