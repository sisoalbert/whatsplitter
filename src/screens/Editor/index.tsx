import {useState} from 'react';
import {StyleSheet, Text, Pressable, View, Dimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {launchImageLibrary} from 'react-native-image-picker';
import Video from 'react-native-video';
import {FFmpegKit, ReturnCode, FFmpegKitConfig} from 'ffmpeg-kit-react-native';
import RNFS from 'react-native-fs';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;

const Editor = () => {
  const [selectedVideo, setSelectedVideo] = useState(null); // {uri: <string>, localFileName: <string>, creationDate: <Date>}
  const [trimmedVideoSource, setTrimmedVideoSource] = useState(null);
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

  const handleVideoLoad = () => {
    let outputImagePath = `${RNFS.CachesDirectoryPath}/${selectedVideo.localFileName}.mp4`;
    FFmpegKit.execute(
      `-i ${selectedVideo.uri} -c:v mpeg4 ${outputImagePath}`,
    ).then(async session => {
      const state = FFmpegKitConfig.sessionStateToString(
        await session.getState(),
      );
      const returnCode = await session.getReturnCode();
      const failStackTrace = await session.getFailStackTrace();
      const duration = await session.getDuration();

      if (ReturnCode.isSuccess(returnCode)) {
        console.log(
          `Encode completed successfully in ${duration} milliseconds;`,
        );
      } else if (ReturnCode.isCancel(returnCode)) {
        console.log('Encode canceled');
      } else {
        console.log(
          `Encode failed with state ${state} and rc ${returnCode}.${
            (failStackTrace, '\\n')
          }`,
        );
      }
    });
  };

  const trimVideo = async () => {
    setTrimmedVideoSource(null);
    try {
      const trimmedVideoPath = `${RNFS.TemporaryDirectoryPath}/trimmed_video_${selectedVideo.localFileName}.mp4`;
      const inputPath = selectedVideo.uri;
      const outputPath = trimmedVideoPath;
      const startTime = 0;
      const duration = 30;

      await FFmpegKit.execute(
        `-ss ${startTime} -i "${inputPath}" -t ${duration} -c copy "${outputPath}"`,
      );

      console.log('Video trimmed successfully:', trimmedVideoPath);
      setTrimmedVideoSource(trimmedVideoPath);
    } catch (err) {
      console.log('Error trimming video:', err);
    }
  };
  console.log(
    `trimmedVideoSource video ${JSON.stringify(trimmedVideoSource, null, 2)}`,
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      {selectedVideo || trimmedVideoSource ? (
        <View style={styles.videoContainer}>
          {
            trimmedVideoSource ? (
              <Video
                source={{uri: trimmedVideoSource}}
                style={[
                  {
                    width: SCREEN_WIDTH,
                    height: 0.6 * SCREEN_HEIGHT,
                    borderWidth: 2,
                    borderColor: 'red',
                  },
                  styles.video,
                ]}
                resizeMode={'contain'}
                controls
              />
            ) : null
            // <Video
            //   style={styles.video}
            //   resizeMode={'cover'}
            //   source={{uri: selectedVideo.uri}}
            //   repeat
            //   onLoad={handleVideoLoad}
            //   controls
            // />
          }
          <Pressable style={styles.buttonContainer} onPress={trimVideo}>
            {trimmedVideoSource ? (
              <Text style={styles.buttonText}>Save video</Text>
            ) : (
              <Text style={styles.buttonText}>Trim video</Text>
            )}
          </Pressable>
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
  },
  video: {
    height: '100%',
    width: '100%',
  },
});
export default Editor;
