
import { useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  getFirestore,
  updateDoc,
  deleteField,
  arrayUnion
} from "firebase/firestore";
import FirebaseLocal from "../../FirebaseLocal";
import logo from "../../../src/assets/images/logo-white.png";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
 
import $ from "jquery";
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/js/src/collapse.js";

import notificationSound from '../../../src/assets/sounds/notification.mp3'
import { useEffect, useState } from "react";
var modifiedData: any = new Array();
var userName: string = "";
var avatarLink: string = "";
var isAttachmentDialogOpened: boolean = false;
var imagePhotoPath: any = "";
var activeTab:boolean = true;
var isMessageOptionOpened:boolean = false;
function Chat() { 

    const navigate = useNavigate();
    if (localStorage.getItem("user") == null)
    {
        useEffect(
          () => { 
             navigate("/");  }, ); 
    }
    
  window.addEventListener("focus", function () {
    document.title = "Chat - ChatFoom";
    activeTab = true;
    
  });

  window.addEventListener("blur", function () {
    document.title = "Chat - ChatFoom";
    activeTab = false;
    
  });
  var isEmogiPickerOpened: boolean = false;

 
  setTimeout(() => {
    getUserProfile();

  },2000)


  setTimeout(() => {

    $("#notificationSound").trigger('load');
    var messageInput: any = document.querySelector(".type-text-input");
    messageInput.addEventListener("keypress", (e: any) => {
      if (e.keycode === 13 || e.which === 13) {
        e.preventDefault();
        e.stopImmediatePropagation();
        handleSendMessage();
      }
    });
    getLiveMessageFromServe(document.getElementsByClassName("chat-area")[0]);
    getOnceMessageFromServe(document.getElementsByClassName("chat-area")[0]);

    openCloseAttachmentBox();
    listenToImportantMessages();
    
    moreFeatures();
    $(".chat-private-room").click(()=>{ 
        logoutUser();
      })
      $(".type-text-input").click(()=>{ 
      
        $(".three-dots-menu-options-list").hide();
      })
      
     


    $(".attachment-send-photo").unbind().click(function() {
         
        var fileElement: any = document.getElementsByClassName("attachment-photo-input")[0];
        fileElement.click();
        fileElement.addEventListener("change", () => {
          if (fileElement.files && fileElement.files[0]) {
            if (fileElement.files[0].type.includes("image")) {
              var allowedSize = 0;
              var storeMedia = "open";
              var fileName = "testing";
              var fileSize = fileElement.files[0].size;
              imagePhotoPath = fileElement.files[0];
              

             // upload(fileElement.files[0].type, storeMedia, fileName, fileSize);
            }
          }
        });

          
    });

  }, 1000);




  const handleSendMessage = () => {
    const message: any = document.getElementsByClassName("type-text-input")[0];
    const chatArea = document.getElementsByClassName("chat-area")[0];
    if (message.value != "") { 

      sendMessageToServe(
        userName,
        message.value,
        Date.now(),
        "right",
        avatarLink,
        "text",
        ""
      );

      message.value = "";
    }
  };

  const openEmogi = () => {
    var emogiContainer: any = document.getElementsByClassName(
      "emogi-open-container"
    )[0];
    emogiContainer.style.display = "flex";
    isEmogiPickerOpened = false;
  };

  const clickedOutsideEmogiPicker = () => {
    if (isEmogiPickerOpened) {
      var emogiContainer: any = document.getElementsByClassName(
        "emogi-open-container"
      )[0];
      emogiContainer.style.display = "none";
    }
    isEmogiPickerOpened = true;
  };

  const onEmojiSelect = (v: any) => {
    const message: any = document.getElementsByClassName("type-text-input")[0];
    message.value += " " + v.native;
  };

  const openSettings = ()=>{
    

    var settingRoot:any = document.getElementsByClassName("chat-settings-slider")[0];
    settingRoot.style.display = "flex";

  }
  
  const closeSlider = ()=>{
    var settingRoot:any = document.getElementsByClassName("chat-settings-slider")[0];
    settingRoot.style.display = "none";

  }
  async function setNewAvatar(e:any){ 
    e.preventDefault();
    e.stopPropagation();
    var src = e.nativeEvent.srcElement.currentSrc; 
    $(".chat-settings-avatar").attr("src" , src);

    var userId: any = localStorage.getItem("user");
    const app = FirebaseLocal.initFirebase();
    const firestore = getFirestore(app);
    const profileRef = doc(firestore, 'chat-foom', 'users', JSON.parse(userId).uid, "profile");

    await setDoc(profileRef, {
        "avatar":src
    }, {merge:true}).then(
        ()=>{   getUserProfile();

    }).catch((e)=>{ 

    })
    
  }

  const sliderBenethClickBlocker = (e:any)=>{
    e.preventDefault();
    e.stopPropagation();
  }

  const openImportantMessages = (e:any)=>{
   
  }

  const visitDiscord = (e:any)=>{
  
    window.open("https://discord.gg/YNCMYEsm", "_target")
  }
  const logoutUserMobile = (e:any)=>{
    logoutUser(); 
  }
  

  

  return (


    <div className="chat-root">
      <audio id="notificationSound" src={notificationSound}></audio>

        <div onClick={closeSlider} className="chat-settings-slider">
            <div onClick={sliderBenethClickBlocker}  className="chat-settings-slider-inner">
                <i onClick={closeSlider} className="fa-solid fa-xmark close-settings"></i>
                <img className="chat-settings-avatar" src=""></img>
                <h2 className="chat-settings-user-name" ></h2>
                <div className="chat-settings-user-id-container">
                    <p className="chat-settings-user-id-value"></p>
                    <p>User ID</p> 
                </div>
                <p className="chat-settings-separator"></p>
                <div className="chat-settings-user-email-container">
                    <p className="chat-settings-user-email-value"></p>
                    <p>Email address</p> 
                </div>
                <p className="chat-settings-separator"></p>
                <div className="chat-settings-user-change-avater-container">
                    <div>
                        <img onClick={setNewAvatar} src="https://firebasestorage.googleapis.com/v0/b/chat-foom.appspot.com/o/avatars%2Favatar-1.png?alt=media&token=91c75fbd-0b68-4bf2-930c-43c48752aac6"></img>
                        <img onClick={setNewAvatar} src="https://firebasestorage.googleapis.com/v0/b/chat-foom.appspot.com/o/avatars%2Favatar-2.png?alt=media&token=fe5722fc-e999-4b89-9460-25a7da8d45a2"></img>
                        <img onClick={setNewAvatar} src="https://firebasestorage.googleapis.com/v0/b/chat-foom.appspot.com/o/avatars%2Favatar-3.png?alt=media&token=592b6c0f-7159-404e-958a-5b32cce7687d"></img>
                        <img onClick={setNewAvatar} src="https://firebasestorage.googleapis.com/v0/b/chat-foom.appspot.com/o/avatars%2Favatar-4.png?alt=media&token=e32b85d9-30be-432a-a01f-e1ab6ee35265"></img>
                        <img onClick={setNewAvatar} src="https://firebasestorage.googleapis.com/v0/b/chat-foom.appspot.com/o/avatars%2Favatar-5.png?alt=media&token=fdecc485-485c-4715-aa61-6225aebc8dd2"></img>
                        <img onClick={setNewAvatar} src="https://firebasestorage.googleapis.com/v0/b/chat-foom.appspot.com/o/avatars%2Favatar-6.png?alt=media&token=508b3149-9eeb-4831-b516-91e75b1b122e"></img>
                        <img onClick={setNewAvatar} src="https://firebasestorage.googleapis.com/v0/b/chat-foom.appspot.com/o/avatars%2Favatar-7.png?alt=media&token=97dc6039-dba4-4c60-bb19-c3ae8254d73f"></img>
                        <img onClick={setNewAvatar} src="https://firebasestorage.googleapis.com/v0/b/chat-foom.appspot.com/o/avatars%2Favatar-8.png?alt=media&token=12039158-7ead-4f7d-b79d-fbec4321da6f"></img>
                        <img onClick={setNewAvatar} src="https://firebasestorage.googleapis.com/v0/b/chat-foom.appspot.com/o/avatars%2Favatar-9.png?alt=media&token=c5aedee3-b825-4970-9245-8a172db41370"></img>
                        <img onClick={setNewAvatar} src="https://firebasestorage.googleapis.com/v0/b/chat-foom.appspot.com/o/avatars%2Favatar-10.png?alt=media&token=ca60253d-af12-46da-93ac-66dff14d1c4b"></img>
                        <img onClick={setNewAvatar} src="https://firebasestorage.googleapis.com/v0/b/chat-foom.appspot.com/o/avatars%2Favatar-11.png?alt=media&token=2f68d9e2-6b8f-4d48-8f1c-f30160c0a6c4"></img>
                    </div>
                    <p>Available avatars: Click to select new avatar</p> 
                </div>
                <p className="chat-settings-separator mobile-setting-nav-separator temp-hide"></p>
                <div onClick={openImportantMessages}  className="chat-settings-important-messages-container temp-hide">
                    <p>View</p>
                    <p>Important messages</p> 
                </div>
                <p className="chat-settings-separator mobile-setting-nav-separator"></p> 
                <div onClick={visitDiscord} className="chat-settings-join-discord-container">
                    <p>Join discord</p>
                    <p>Join discord to request new features </p> 
                </div>
                <p className="chat-settings-separator"></p>
                <div className="chat-settings-user-version-container">
                    <p>1.0</p>
                    <p>App version</p> 
                </div>
                <p className="chat-settings-separator mobile-setting-nav-separator"></p>
                <div onClick={logoutUserMobile}  className="chat-settings-logout-container">
                    <p>Logout</p>  
                </div>


            </div>
        
        </div>
      <div className="chat-inner-container">
     
        <div className="chat-nav">
        <div className="notification-system"> 
        </div>
        <div onClick={openSettings} className="chat-navbar">

        <i   className="fa-solid fa-bars "></i>
        </div>
        
          <div className="chat-foom-name-dev-container">
            <img className="chat-foom-logo" src={logo} />
            <h1 className="chat-foom-name-itself">CHAT FOOM</h1>
            <p className="chat-developed-by">by Saad Zahoor</p>
          </div> 
         
          <h2 className="chat-user-name"></h2>
          <p className="chat-global-group">
            <i className="fa-solid fa-globe chat-nav-icon"></i> Global room
          </p>
          <p className="chat-private-room">
             <i className="fa-solid fa-right-from-bracket chat-nav-icon"></i>  Logout
          </p>
          <i onClick={openSettings} className="fa-solid fa-gear chat-settings"></i>
        </div>
        <div className="chat-inner-root">
          <div className="chat-left">
 
          
               

            <div className="chat-left-important-message-container">
                <div className="chat-left-im-box">
                    <p className="important-message-text">0</p>
                    <p>Important messages</p>
                </div> 
                <div className="chat-left-im-container">
                    

                </div>

            </div> 
            <div className="chat-left-current-member-container temp-hide">
                    <p className="peps-in-room">People in the room</p>
                    <div className="chat-left-current-member-container-inner">

                    </div>
            </div>

         


          </div>
          <div className="chat-right">
            <div className="emogi-open-container shadow-lg">
              <Picker
                onClickOutside={clickedOutsideEmogiPicker}
                data={data}
                onEmojiSelect={onEmojiSelect}
              />
            </div>

            <div className="attachment-open-container temp-hide shadow-lg">
              <p className="attachment-send-photo">
                <input
                  className="attachment-photo-input"
                  type="file"
                  accept="image/*"
                ></input>
            <i className="fa-solid fa-image"></i> Send photo
              </p>
              <p className="attachment-separator"></p>
              <p>
                <i className="fa-solid fa-video"></i> Send video
              </p>
              <p className="attachment-separator"></p>
              <p>
                <i className="fa-solid fa-file"></i> Send document
              </p>
            </div>

            <div className="chat-area">
            

            </div>
            
            <div className="chat-send shaodw-lg">
              <div className="add-attachment temp-hide">
                <i className="fa-solid fa-plus"></i>
              </div>
              <input
                className="type-text-input"
                placeholder="Type a message here..."
              />
              <div className="emogi-send-message-container">
                <div onClick={openEmogi} className="emogi-container">
                  <i className="fa-solid fa-face-smile"></i>
                </div>
                <div onClick={handleSendMessage} className="send-container">
                  <i className="fa-solid fa-location-arrow"></i>
                </div>
              </div>
            </div>


          </div>

          <div className="chat-more">
            <p>Features</p>
            <div className="share-location-container temp-hide" >

                <button className="share-location" >  Share my location
                </button>
            </div>
            <p className="feature-separator temp-hide"></p>
            <div className="discord-container">
                <i className="fa-brands fa-discord"></i>
                <p>Request new feature on discord only!</p>
                <a target="_blank" href="https://discord.gg/YNCMYEsm">Go to discord</a>
            </div>
            <div className="more-features-coming-soon-container">
             <i className="fa-solid fa-laptop-code"></i>
                <p>More feature's coming soon! Stay tune.</p>
            </div>
           
            
          </div>
        </div>
      </div>
    </div>
  );
}

function moreFeatures() {
 
}


function displaySettingInformation(avatar:any, name:any, id:any, email:any){

    $(".chat-settings-avatar").attr("src" , avatar);
    $(".chat-settings-user-name").html(name);
    $(".chat-settings-user-email-value").html(email);
    $(".chat-settings-user-id-value").html(id);
}


async function getUserProfile() {
  var userId: any = localStorage.getItem("user");
  const app = FirebaseLocal.initFirebase();
  const firestore = getFirestore(app); 
  const docRef = doc( firestore, "chat-foom", "users",  JSON.parse(userId).uid, "profile" );
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    userName = docSnap.data().name;
    avatarLink = docSnap.data().avatar;
    var userNameElement: any =  document.getElementsByClassName("chat-user-name")[0];
    var modifiedUserName = userName;
    if (modifiedUserName.includes(" "))
    {
      modifiedUserName = modifiedUserName.split(" ")[0] +" "+ modifiedUserName.split(" ")[1].charAt(0).toUpperCase() + ".";
    }
    userNameElement.innerHTML =`<img class="chat-user-avatar" src="${avatarLink}">` + modifiedUserName;
    displaySettingInformation(avatarLink, userName, JSON.parse(userId).uid,docSnap.data().email );

} else {
    console.log("No such document!");
  }
}
async function sendMessageToServe(
  id: any,
  message: any,
  timestamp: any,
  direction: any,
  avatarLink: any,
  messageType: any,
  imageUrl: any,
) {
 const app = FirebaseLocal.initFirebase();
  const firestore = getFirestore(app);
  try {
    var userUid: any = localStorage.getItem("user");
    var data = {
      [timestamp]: {
        uid: JSON.parse(userUid).uid,
        message: message,
        id: id,
        timestamp: timestamp,
        direction: direction,
        avatarLink: avatarLink,
        messageType: messageType,
        imageUrl: imageUrl
      },
    };
    const cityRef = doc(firestore, "chat-foom", "global");
    await setDoc(cityRef, data, { merge: true });

    console.log("Document written with ID: ");
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
async function getOnceMessageFromServe(chatArea: any) {
   
  const app = FirebaseLocal.initFirebase();
  const firestore = getFirestore(app);
  const docRef = doc(firestore, "chat-foom", "global");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    var data: any = docSnap.data();
    chatArea.innerHTML = "";
    for (var d in data) {
      modifiedData.push(data[d]);
    }

    modifiedData = modifiedData.sort((a: any, b: any) => {
      return b.timestamp - a.timestamp;
    });
    
   

    for (var d in modifiedData) {
      var uid = modifiedData[d].uid;
      var message = modifiedData[d].message;
      var id = modifiedData[d].id;
      var timestamp = modifiedData[d].timestamp;
      var direction = modifiedData[d].direction;
      var avatarLink = modifiedData[d].avatarLink; 
      var messageType = modifiedData[d].messageType;
      var imageUrl = modifiedData[d].imageUrl;

      var localUser: any = localStorage.getItem("user");
    if (uid === JSON.parse(localUser).uid) {
        direction = "right";
        if (messageType === "text")
        {
            chatArea.innerHTML += `
            <div class="message-with-image">
                <div class="message-container-${direction}">
                <i wholemessage='${JSON.stringify(modifiedData[d])}' timestamp="${timestamp}" name="dotsMenu" getContainerC="${d}" class="fa-solid fa-ellipsis-vertical three-dots-menu-option"></i>
                <div class="shadow-lg three-dots-menu-options-list three-dots-menu-${d}">
                    <p class="dm-clone"><i class="fa-solid fa-clone"></i>Copy</>
                    <p class="dots-menu-separator"></p>
                    <p class="dm-delete"><i class="fa-solid fa-trash"></i> Delete</>
                    <p class="dots-menu-separator"></p>
                    <p class="dm-important"><i class="fa-solid fa-star"></i> Mark important</>
                </div>
                <p class="user-id">${id}</p>
                <p class="user-message">${message}</p>
                <p class="user-timestamp">${new Date(
                  timestamp
                ).toLocaleString()}</p>
                </div>
                <img class="message-with-image-right shadow-lg" src="${avatarLink}">
              
            </div> 
            `;
        }
        else if (messageType === "image")
        {
            // chatArea.innerHTML += `
            // <div class="message-with-image">
            //     <div class="message-container-${direction}">
            //             <p class="user-id">${id}</p>
            //             <img class="user-image-message"
            //             src="${imageUrl}" /> 
            //             <p class="user-timestamp">${new Date( timestamp
            //             ).toLocaleString()}</p>
            //     </div>

            //     <img class="message-with-image-right shadow-lg" src="${avatarLink}">
              
            // </div> 
            // `;
        }
        else if (messageType === "video")
        {
        }
        else if (messageType === "voice")
        {
        }
        else if (messageType === "location")
        {
        } 


      } 
      else {
        direction = "left";
        chatArea.innerHTML += `
                <div class="message-with-image">

                    <img class="message-with-image-left shadow-lg" src="${avatarLink}">
                    <div class="message-container-${direction}">
                    <p class="user-id">${id}</p>
                    <p class="user-message">${message}</p>
                    <p class="user-timestamp">${new Date(
                      timestamp
                    ).toLocaleString()}</p>
                    </div>
                  
                </div>
                
                
                `;
      }

     
     
      // unsub();
    document.getElementsByName("dotsMenu").forEach((e:any)=>{
        e.addEventListener("click", ()=>{
            $(".three-dots-menu-options-list").hide();
            var id = e.getAttribute("getContainerC");
            var timestamp = e.getAttribute("timestamp");
            var wholeMessage = e.getAttribute("wholemessage");
            const showDotMenu:any = document.getElementsByClassName(`three-dots-menu-${id}`)[0];
            showDotMenu.style.display = "flex";  
            isMessageOptionOpened = true;
            // showDotMenu.addEventListener("click", (event:any)=>{
            //   event.stopPropagation()
            // })
           
            

            $(".dm-clone").click(()=>{
                notificationSystem("Message is copied to clipboard.", "fa-solid fa-clone");
                copyMessage(JSON.parse(wholeMessage).message);
                showDotMenu.style.display = "none"; 
                isMessageOptionOpened = false; 
            })
            $(".dm-delete").click(()=>{
                notificationSystem("Message is deleted successfully", "fa-solid fa-star");
                deleteMessage(timestamp);
                showDotMenu.style.display = "none"; 
                isMessageOptionOpened = false; 
            })
            $(".dm-important").click(()=>{
                notificationSystem("Message is marked as important.", "fa-solid fa-trash");
                markImportant(wholeMessage);
                showDotMenu.style.display = "none"; 
                isMessageOptionOpened = false; 
            })
            


        })
    })
 
    }
  }
}
async function getLiveMessageFromServe(chatArea: any) {
    
  const app = FirebaseLocal.initFirebase();
  const firestore = getFirestore(app);
  // modifiedData = new Array();
   
  const unsub:any = onSnapshot(doc(firestore, "chat-foom", "global"), (doc) => {
    var data: any = doc.data();
    chatArea.innerHTML = "";
      
    
    for (var d in data) {
      modifiedData.push(data[d]);
    }
    if (!activeTab)
    { 
        $("#notificationSound").trigger('play');

    }
    modifiedData = modifiedData.sort((a: any, b: any) => {
      return b.timestamp - a.timestamp;
    });

    for (var d in modifiedData) {
      var uid = modifiedData[d].uid;
      var message = modifiedData[d].message;
      var id = modifiedData[d].id;
      var timestamp = modifiedData[d].timestamp;
      var direction = modifiedData[d].direction;
      var avatarLink = modifiedData[d].avatarLink;
      var messageType = modifiedData[d].messageType;
      var imageUrl = modifiedData[d].imageUrl;

      var localUser: any = localStorage.getItem("user");
      if (uid === JSON.parse(localUser).uid) {
        direction = "right";
        if (messageType === "text")
        {
            chatArea.innerHTML += `
            <div class="message-with-image">
                <div class="message-container-${direction}">
                <i wholemessage='${JSON.stringify(modifiedData[d])}' timestamp="${timestamp}" name="dotsMenu" getContainerC="${d}" class="fa-solid fa-ellipsis-vertical three-dots-menu-option"></i>
                <div class="shadow-lg three-dots-menu-options-list three-dots-menu-${d}">
                    <p class="dm-clone"><i class="fa-solid fa-clone"></i>Copy</>
                    <p class="dots-menu-separator"></p>
                    <p class="dm-delete"><i class="fa-solid fa-trash"></i> Delete</>
                    <p class="dots-menu-separator"></p>
                    <p class="dm-important"><i class="fa-solid fa-star"></i> Mark important</>
                </div>
                <p class="user-id">${id}</p>
                <p class="user-message">${message}</p>
                <p class="user-timestamp">${new Date(
                  timestamp
                ).toLocaleString()}</p>
                </div>
                <img class="message-with-image-right shadow-lg" src="${avatarLink}">
              
            </div> 
            `;
        }
        else if (messageType === "image")
        {
            // chatArea.innerHTML += `
            // <div class="message-with-image">
            //     <div class="message-container-${direction}">
            //             <p class="user-id">${id}</p>
            //             <img class="user-image-message"
            //             src="${imageUrl}" /> 
            //             <p class="user-timestamp">${new Date( timestamp
            //             ).toLocaleString()}</p>
            //     </div>

            //     <img class="message-with-image-right shadow-lg" src="${avatarLink}">
              
            // </div> 
            // `;
        }
        else if (messageType === "video")
        {
        }
        else if (messageType === "voice")
        {
        }
        else if (messageType === "location")
        {
        } 


      } else {
        direction = "left";
        chatArea.innerHTML += `
                <div class="message-with-image">

                    <img class="message-with-image-left shadow-lg" src="${avatarLink}">
                    <div class="message-container-${direction}">
                    <p class="user-id">${id}</p>
                    <p class="user-message">${message}</p>
                    <p class="user-timestamp">${new Date(
                      timestamp
                    ).toLocaleString()}</p>
                    </div>
                  
                </div>
                
                
                `;
      }
   

      
    }
    modifiedData = new Array();

   // unsub();
    document.getElementsByName("dotsMenu").forEach((e:any)=>{
        e.addEventListener("click", ()=>{
            $(".three-dots-menu-options-list").hide();
            var id = e.getAttribute("getContainerC");
            var timestamp = e.getAttribute("timestamp");
            var wholeMessage = e.getAttribute("wholemessage");
            const showDotMenu:any = document.getElementsByClassName(`three-dots-menu-${id}`)[0];
            showDotMenu.style.display = "flex"; 
            isMessageOptionOpened = false; 

            $(".dm-clone").click(()=>{
                notificationSystem("Message is copied to clipboard.", "fa-solid fa-clone");
                copyMessage(JSON.parse(wholeMessage).message);
                showDotMenu.style.display = "none";  
                isMessageOptionOpened = false; 
            })
            $(".dm-delete").click(()=>{
                notificationSystem("Message is deleted successfully", "fa-solid fa-star");
                deleteMessage(timestamp);
                showDotMenu.style.display = "none"; 
                isMessageOptionOpened = false; 
            })
            $(".dm-important").click(()=>{
                notificationSystem("Message is marked as important.", "fa-solid fa-trash");
                markImportant(wholeMessage);
                showDotMenu.style.display = "none"; 
                isMessageOptionOpened = false; 
            })
             


        })
    })

  });
}
function openCloseAttachmentBox() {
  var attachmentButton: any =
    document.getElementsByClassName("add-attachment")[0];
  var attachmentContainer: any = document.getElementsByClassName(
    "attachment-open-container"
  )[0];
  attachmentButton.addEventListener("click", () => {
    attachmentContainer.style.display = "flex";
    attachmentButton.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
    isAttachmentDialogOpened = true;
  });
}
 

 
async function upload(
  type: any,
  openOrmedia: any,
  fileName: any,
  fileSize: any
) {
    
  const app = FirebaseLocal.initFirebase();
  const storage = getStorage(app);
  const imagesRef = ref(storage, `${openOrmedia}/image/` + fileName);
  const uploadTask = uploadBytesResumable(imagesRef, imagePhotoPath, {
    contentType: type,
  });

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      const modifiedProgress = progress.toFixed(2);
      console.log("Upload is " + modifiedProgress + "% done");

      //this.progressRealtime.innerHTML = 'Upload is <strong>' + modifiedProgress + '%</strong> completed';

      switch (snapshot.state) {
        case "paused":
          console.log("Upload is paused");
          break;
        case "running":
          console.log("Upload is running");
          break;
      }
    },
    (error) => {},
    () => {
      // Handle successful uploads on complete
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        sendMessageToServe(
            userName,
            "",
            Date.now(),
            "right",
            avatarLink,
            "image",
            downloadURL
          );
        console.log("File available at", downloadURL);
      });
    }
  );
}

async function deleteMessage(timestamp:any){
    const app = FirebaseLocal.initFirebase();
    const firestore = getFirestore(app);
    const chatRef = doc(firestore, 'chat-foom', 'global'); 
    var t = timestamp+""; 

    await updateDoc(chatRef, {
        [t] : deleteField()
    });
    
}
async function markImportant(message:any){ 
    var messageData = JSON.parse(message);
    const app = FirebaseLocal.initFirebase();
    const firestore = getFirestore(app);
    try {
      var userUid: any = localStorage.getItem("user");
      var data = {
        [messageData.timestamp]: {
          uid: JSON.parse(userUid).uid,
          message: messageData.message,
          id: messageData.id,
          timestamp: messageData.timestamp,
          direction: messageData.direction,
          avatarLink: messageData.avatarLink,
          messageType: messageData.messageType,
          imageUrl: messageData.imageUrl
        },
      };
      const cityRef = doc(firestore, "chat-foom", "users", JSON.parse(userUid).uid, "important");
      await setDoc(cityRef, data, { merge: true });
     
      listenToImportantMessages();
  
      console.log("Document written with ID: ");
    } catch (e) {
      console.error("Error adding document: ", e);
    }
}

async function copyMessage(message:any){ 
        try {
          await navigator.clipboard.writeText(message);
          console.log('Content copied to clipboard: ', message);
        } catch (err) {
          console.error('Failed to copy: ', err);
        }
}

async function notificationSystem(notification:any , iconClass:any){
   
    $("#notificationSound").trigger('play');
    const notificationContainer:any = document.getElementsByClassName("notification-system")[0];
    notificationContainer.style.display = 'flex';
    notificationContainer.innerHTML = `
    <i class="${iconClass} noti-icon"></i> <p>${notification}</p>
    `
    setTimeout(() => {
        notificationContainer.innerHTML ="";
        notificationContainer.style.display = 'none';
    }, 2000);
}

async function listenToImportantMessages(){
    var isOpened = false;
     var userUid: any = localStorage.getItem("user");
    const app = FirebaseLocal.initFirebase();
    const firestore = getFirestore(app);
    const docRef = doc(firestore, "chat-foom", "users", JSON.parse(userUid).uid, "important");
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      var data: any = docSnap.data(); 
      for (var d in data) {
        modifiedData.push(data[d]);
      }
  
      modifiedData = modifiedData.sort((a: any, b: any) => {
        return b.timestamp - a.timestamp;
      });
      var size = Object.keys(modifiedData).length;
      $(".important-message-text").html(size+"");

      $(".chat-left-im-box").click(()=>{
        if(isOpened)
        {
            isOpened = false;
            $(".chat-left-im-container").css("display", "none");
            $(".chat-left-im-box").css("background-color", "var(--color-brand-5)")
            $(".chat-left-im-box > *").css("color", "var(--color-black)")
        }else{
            isOpened =true;
            $(".chat-left-im-container").css("display", "flex");
            $(".chat-left-im-box").css("background-color", "var(--color-brand-1)")
            $(".chat-left-im-box > *").css("color", "var(--color-brand-5)")
        }
      })
      var dataHTML = "";
      for (var d in modifiedData) {
        var uid = modifiedData[d].uid;
        var message = modifiedData[d].message;
        var id = modifiedData[d].id;
        var timestamp = modifiedData[d].timestamp;
        var direction = modifiedData[d].direction;
        var avatarLink = modifiedData[d].avatarLink; 
        var messageType = modifiedData[d].messageType;
        var imageUrl = modifiedData[d].imageUrl; 

        dataHTML += `
        <p>${message}</p>
    `
      
        console.log("User important message: " , modifiedData[d])
      }
      var imContainer = document.getElementsByClassName("chat-left-im-container")[0];
      imContainer.innerHTML = dataHTML
       
    }
} 

async function addInTheRoom(){ 
    var userUid: any = localStorage.getItem("user"); 
    const app = FirebaseLocal.initFirebase();
    const firestore = getFirestore(app);
    
  try {
    var userUid: any = localStorage.getItem("user");
    var data = {
       "whoIsIn": arrayUnion(JSON.parse(userUid).uid + ":" + userName)
    }; 
    const docRef = doc(firestore, "chat-foom", "whoIsIn");
    await setDoc(docRef, data, { merge: true }); 
 
  } catch (e) {
    console.error("Error adding document: ", e);
  }
      
}
async function getWhoIsInRoom(){
    $(".chat-left-current-member-container-inner").html();
     alert('called');
    const app = FirebaseLocal.initFirebase();
    const firestore = getFirestore(app); 
    const docRef = doc(firestore, "chat-foom", "whoIsIn");
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
        var data: any = docSnap.data(); 
        console.log('Who is in the room: ' , data.whoIsIn);
        if (data.whoIsIn.length  > 0)
        {
            for(var i=0 ; i< data.whoIsIn.length ; i++) 
            {
                var user = data.whoIsIn[i];
                $(".chat-left-current-member-container-inner").append(
                    `
                        <p class="active-user">${user.split(":")[1]}</p>
                    `
                )

            }
        } 
    }
   
     
}
async function removeFromRoom(){
    
    var userUid: any = localStorage.getItem("user"); 
    const app = FirebaseLocal.initFirebase();
    const firestore = getFirestore(app);
    const docRef = doc(firestore, "chat-foom", "whoIsIn");  
    await updateDoc(docRef, {
        [`whoIsIn.${JSON.parse(userUid).uid}:${userName}`] : deleteField()
    });
     
}

async function logoutUser(){
 
    const app = FirebaseLocal.initFirebase();
    const auth = getAuth(app);
    localStorage.removeItem("user"); 
    auth.signOut();
    
     window.open("/", "_self");

}

export default Chat;
