import {useState} from 'react';
import {StyleSheet, Text, Pressable, View, Dimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {launchImageLibrary} from 'react-native-image-picker';
import Video from 'react-native-video';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;

const Editor = () => {
  const [selectedVideo, setSelectedVideo] = useState(null); // {uri: <string>, localFileName: <string>, creationDate: <Date>}

  const pickVideo = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'video',
        quality: 1,
        includeBase64: true,
      });

      if (result) {
        console.log(`Selected video ${JSON.stringify(result, null, 2)}`);
        setSelectedVideo({
          uri: result.assets[0].uri || result.assets[0].originalPath,
          localFileName: result.assets[0].fileName,
          creationDate: new Date(),
        });
      }
    } catch (err) {
      console.log('Error picking video:', err);
    }
  };

  console.log(`Selected video ${JSON.stringify(selectedVideo, null, 2)}`);

  //   const handlePressSelectVideoButton = () => {
  //     ImagePicker.openPicker({
  //       mediaType: 'video',
  //     }).then(videoAsset => {
  //       console.log(`Selected video ${JSON.stringify(videoAsset, null, 2)}`);
  //       setSelectedVideo({
  //         uri: videoAsset.sourceURL || videoAsset.path,
  //         localFileName: getFileNameFromPath(videoAsset.path),
  //         creationDate: videoAsset.creationDate,
  //       });
  //     });
  //   };
  return (
    <SafeAreaView style={styles.mainContainer}>
      {selectedVideo ? (
        <View style={styles.videoContainer}>
          <Video
            style={styles.video}
            resizeMode={'cover'}
            source={{uri: selectedVideo.uri}}
            repeat={true}
          />
        </View>
      ) : (
        <Pressable style={styles.buttonContainer} onPress={pickVideo}>
          <Text style={styles.buttonText}>Select a video</Text>
        </Pressable>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 16,
  },
  buttonText: {
    color: '#fff',
  },
  videoContainer: {
    width: SCREEN_WIDTH,
    height: 0.6 * SCREEN_HEIGHT,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
  },
  video: {
    height: '100%',
    width: '100%',
  },
});
export default Editor;
