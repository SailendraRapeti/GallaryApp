import { SafeAreaView, Platform , Text,PermissionsAndroid, TouchableOpacity, StyleSheet, View, Image, FlatList, Alert} from 'react-native'
import React, { Component } from 'react'
import { request, PERMISSIONS } from 'react-native-permissions';
import {CameraOptions, ImagePickerResponse, launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
interface Istate{
  
  array:any;
  selectedImage:any;
 
}
export class Gallary extends Component<Istate> {
state={
    array:[],
    selectedImage:""
}
    onImage=()=>{
            const options ={
              title:"select an image",
              sourseType:launchImageLibrary
            }
            launchImageLibrary(options,response => {
              if(response.didCancel){
                console.log("user cancled")
          
              }else if (response.errorCode){
                console.log("error picking image :",response.errorCode)
              }else {
                this.setState({
                  array:[...this.state.array,response.assets[0].uri]
                })
              }
            })
            }

            requestCameraPermission = async () => {
              try {
                if (Platform.OS === 'android') {
                  const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                      title: 'Camera Permission',
                      message: 'App needs access to your camera.',
                      buttonPositive: 'OK',
                      buttonNegative: 'Cancel',
                    }
                  );
            
                  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Camera permission granted');
                    console.log("123")
                      const options: CameraOptions = {
                        mediaType : "mixed",
                      }
                      launchCamera(options,(res:ImagePickerResponse)=>{
                        const result : any = res.assets;
                        console.log(result[0].uri)
                        if (result[0].uri !== null){
                          this.setState({array:[...this.state.array,result[0].uri]})
                    
                        }
                       
                      })
                  } else {
                    console.log('Camera permission denied');
                    // Handle permission denial, e.g., show an error message or fallback functionality
                  }
                } else {
                  // For iOS, use the permission library or handle accordingly
                  const result = await request(PERMISSIONS.IOS.CAMERA);
                  if (result === 'granted') {
                    console.log('Camera permission granted');
                    // You can now access the camera
                    const options: CameraOptions = {
                      mediaType : "mixed",
                    }
                    launchCamera(options,(res:ImagePickerResponse)=>{
                      const result : any = res.assets;
                      console.log(result[0].uri)
                      if (result[0].uri !== null){
                        this.setState({array:[...this.state.array,result[0].uri]})
                  
                      }
                     
                    })
                  } else {
                    console.log('Camera permission denied');
                    // Handle permission denial, e.g., show an error message or fallback functionality
                  }
                }
              } catch (error) {
                console.log('Error while requesting camera permission:', error);
              }
            };

            handleSaveToGallery = () => {
              const {selectedImage} = this.state;
             
                if (!selectedImage) {
                  console.log('Selected image is undefined');
                  return;
                }
                try {
                  if (Platform.OS === 'android') {
                    CameraRoll.save(selectedImage);
                  } else {
                    CameraRoll.save(selectedImage);
                  }
                } catch (error) {
                  console.log(error);
                }
            
            };

            createAlert = () => {
              Alert.alert('Alert Title', 'Download Image', [
                {
                  text: 'Save to Gallery',
                  onPress: () => this.handleSaveToGallery(),
                },
               
              ]);
            };

            longPress = (item:any) => {
                this.setState({selectedImage: item});
                this.createAlert();
              
            };




// onCamera=()=>{
//   console.log("123")
//   const options: CameraOptions = {
//     mediaType : "mixed",
//   }
//   launchCamera(options,(res:ImagePickerResponse)=>{
//     const result : any = res.assets;
//     console.log(result[0].uri)
//     if (result[0].uri !== null){
//       this.setState({array:[...this.state.array,result[0].uri]})

//     }
   
//   })
// }


  render() {
    const {array}=this.state
    console.log("image",array)
    return (
      <SafeAreaView>
      <View style={style.container}>

     
      <TouchableOpacity style={style.but} onPress={this.requestCameraPermission} >
        <Text style={{color:"white",textAlign:"center"}}> Open Camera</Text>
      </TouchableOpacity>
      <TouchableOpacity style={style.but} onPress={this.onImage}>
        <Text style={{color:"white",textAlign:"center"}}> UpLoad Image</Text>
      </TouchableOpacity>

  
        <FlatList
        data={array}
        numColumns={3}
      renderItem={({item})=>(
    <TouchableOpacity onLongPress={()=>{this.longPress(item)}}>

   
        <Image
        style={style.im}
        source={{uri: `${item}`}} />
 </TouchableOpacity>
      )}
     
      />
    <Text style={{color:"white"}}>sai</Text>
      </View>

     
      </SafeAreaView>

      
    )
  }
}
const style=StyleSheet.create({
  container:{
    height:"100%",
    alignItems:"center",
    backgroundColor: 'black',
  },
  but:{
   height:50,
   width:150,
   backgroundColor:"#E08460",
   padding:15,
   margin:20,

  },
  im:{
    height:100,
    width:100,
    margin:8
   
  }
})

export default Gallary