import {
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  View,
  Vibration,
} from 'react-native';
import React from 'react';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import Sound from 'react-native-sound';

const PermissionsPage = () => {
  const {requestPermission} = useCameraPermission();
  React.useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  return (
    <SafeAreaView>
      <Text>Permissions is required.</Text>
    </SafeAreaView>
  );
};

const NoCameraDeviceError = () => {
  return (
    <View>
      <Text>No camera device found.</Text>
    </View>
  );
};

function CameraScreen() {
  const device = useCameraDevice('back');
  const {hasPermission} = useCameraPermission();
  const cameraRef: any = React.useRef(null);
  const [photo, setPhoto] = React.useState(null);
  console.log(photo);

  // Enable playback in silence mode
  Sound.setCategory('Playback');

  // Load the sound file 'whoosh.mp3' from the app bundle
  // See notes below about preloading sounds within initialization code below.
  const cameraSound = new Sound('camera.mp3', Sound.MAIN_BUNDLE, error => {
    if (error) {
      console.log('failed to load the sound', error);
      return;
    }
  });

  const takePhoto = async () => {
    if (cameraRef.current) {
      const options = {quality: 0.8, flashMode: 'on'};
      const capturedPhoto = await cameraRef.current.takePhoto(options);
      setPhoto(capturedPhoto.path);
      cameraSound.play();
    }
  };

  if (!hasPermission) return <PermissionsPage />;
  if (device == null) return <NoCameraDeviceError />;

  return (
    <>
      {photo ? (
        <>
          <Image style={{flex: 1}} source={{uri: `file://'${photo}`}} />
          <TouchableOpacity
            onPress={() => {
              setPhoto(null);
              Vibration.vibrate();
            }}
            style={{
              borderColor: 'black',
              borderWidth: 2,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
            }}>
            <Text>Back</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={StyleSheet.absoluteFill}>
          <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            photo={true}
            ref={cameraRef}
          />
          <TouchableOpacity
            onPress={takePhoto}
            style={{
              position: 'absolute',
              bottom: 10,
              alignSelf: 'center',
              backgroundColor: 'white',
              height: 50,
              width: 50,
              borderRadius: 25,
              borderColor: 'black',
              borderWidth: 2,
              justifyContent: 'center',
            }}
          />
        </View>
      )}
    </>
  );
}

export default CameraScreen;
const styles = StyleSheet.create({});
