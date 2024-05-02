import RNFS from 'react-native-fs';
import {pick} from 'react-native-document-picker';
import {launchImageLibrary} from 'react-native-image-picker';
import Video, {VideoRef} from 'react-native-video';
import {Button, Text, View} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

export default function Trimmer() {
  const navigation = useNavigation();
  const [videoSource, setVideoSource] = React.useState(null);
  const [filePath, setFilePath] = React.useState(null);
  const [fileName, setFileName] = React.useState(null);
  const videoRef = React.useRef<VideoRef>(null);
  const writeFiles = () => {
    // create a path you want to write to
    // :warning: on iOS, you cannot write into `RNFS.MainBundlePath`,
    // but `RNFS.DocumentDirectoryPath` exists on both platforms and is writable
    var path = RNFS.DocumentDirectoryPath + '/test.txt';

    // write the file
    RNFS.writeFile(path, 'Lorem ipsum dolor sit amet', 'utf8')
      .then(success => {
        console.log('FILE WRITTEN!:' + path);
      })
      .catch(err => {
        console.log(err.message);
      });
  };
  const pickVideo = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'video',
        quality: 1,
        includeBase64: true,
      });
      console.log('uri', result.assets[0].uri);
      console.log(result.assets[0].fileName);

      if (result) {
        setVideoSource(result.assets[0].uri);
        setFileName(result.assets[0].fileName);
      }
    } catch (err) {
      console.log('Error picking video:', err);
    }
  };

  const trimVideo = async () => {
    try {
      const trimmedVideoPath = `${RNFS.TemporaryDirectoryPath}/trimmed_video.mp4`;
      const trimmedVideoInfo = await VideoEditor.trim({
        source: videoSource,
        startTime: 0,
        endTime: 30,
        outputPath: trimmedVideoPath,
      });

      console.log('Trimmed video info:', trimmedVideoInfo);
    } catch (err) {
      console.log('Error trimming video:', err);
    }
  };
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{fontSize: 30}}>Video Trimmer.</Text>
      <Text>Upload a video and we'll trim it to 30 seconds.</Text>
      {videoSource && <Text>{fileName}</Text>}
      {videoSource && (
        <Video
          // Can be a URL or a local file.
          source={{uri: videoSource}}
          // Store reference
          ref={videoRef}
          // Callback when remote video is buffering
          onBuffer={() => console.log('buffering')}
          // Callback when video cannot be loaded
          onError={(e: any) => console.log('Error:', e)}
          style={{width: 300, height: 300}}
          controls
          onProgress={(e: any) => console.log(e.currentTime)}
        />
      )}
      <Button
        title="Go to Camera"
        onPress={() => {
          navigation.navigate('Camera');
        }}
      />

      <Button title="write Files" onPress={() => writeFiles()} />

      <Button
        title="open file"
        onPress={async () => {
          try {
            const [result] = await pick({
              mode: 'open',
            });
            console.log(result);
          } catch (err) {
            // see error handling
          }
        }}
      />

      <Button title="pick video" onPress={pickVideo} />
      {/* clear */}
      <Button
        title="clear"
        onPress={() => {
          setVideoSource(null);
          setFileName(null);
        }}
      />
    </View>
  );
}
