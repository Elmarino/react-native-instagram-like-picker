import React from 'react';
import {
    Platform,
    View,
    Text,
    ActivityIndicator,
    FlatList,
    Image, TouchableOpacity, ImageBackground, Modal, Dimensions
} from 'react-native'
import CameraRoll from '@react-native-community/cameraroll';
import * as ImagePicker from 'react-native-image-picker'
import FastImage from 'react-native-fast-image'

const { height, width } = Dimensions.get('screen');

const options = {
    title: 'Choisir',
    storageOptions: {
        skipBackup: true,
        path: 'Sakana',
        cameraRoll: true,
        waitUntilSaved: true,
    },
    mediaType: 'mixed',
    videoQuality: 'high',
    durationLimit: 20,
    thumbnail: true,
    cancelButtonTitle: 'Annuler',
    allowsEditing: false,
}

export default class FileColletor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            images: [],
            multipleSelected: false,
            initialLoading: true,
        };
    }

    componentDidMount() {
        this.fetchImages();
    }

    fetchImages = () => {

        let fetchParams = {
            first: 1000,
            groupTypes: 'All',
            assetType: 'All',
        };
        if (Platform.OS === "android") {
            delete fetchParams.groupTypes;
        }
        CameraRoll.getPhotos(fetchParams).then(result => {
            this.setState({ images: result.edges });
            this.props.onSelectImage(result.edges[0]);

            setTimeout(
                () => {
                    this.setState({ initialLoading: false });
                }, 500
            )


        }).catch((err) => {
            console.log(err)
        });


    }

    camera = async () => {
        const result = await ImagePicker.launchCamera(options);
        this.props.onSelectImage(result.assets[0], true);
    }

    selectedImage(item, index) {
        this.props.onSelectImage(item);
        var { images } = this.state;
        images.map((item, index) => {
            if (item.selected) item.selected = false
        })
        images[index].selected = true;
        setTimeout(() => {
            this.setState({ images });
        }, 300)
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.initialLoading}
                >
                    <View style={{
                        flex: 1,
                        backgroundColor: '#00000080',
                        paddingHorizontal: 10,
                        paddingVertical: height / 8,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <ActivityIndicator size="large" color="#fcab16" />
                    </View>
                </Modal>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    numColumns={3}
                    data={this.state.images}
                    extraData={this.state}
                    keyExtractor={(item, index) => index}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity key={index} style={{ marginBottom: 1, marginRight: 1, }}
                            onPress={() => this.selectedImage(item, index)}
                        >
                            <View style={{ width: width / 3, height: width / 3, opacity: item.selected ? .4 : 1 }}>
                                {{/* <Image
                                    style={{ width: width / 3, height: width / 3 }}
                                    source={{ uri: item.node.image.uri }}
                                    resizeMethod={'resize'}
                                /> */}}
                                <FastImage
                                    style={{ width: width / 3, height: width / 3 }}
                                    source={{
                                        uri: item.node.image.uri,
                                        priority: FastImage.priority.normal,
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}
                                    resizeMethod={'resize'}
                                />
                            </View>
                            {this.state.multipleSelected ? (
                                <View style={{
                                    position: 'absolute',
                                    top: 5,
                                    right: 5,
                                    backgroundColor: '#2473f0',
                                    height: 25, width: 25,
                                    borderRadius: 100,
                                    borderColor: '#FFFFFF',
                                    borderWidth: 2, justifyContent: 'center', alignItems: 'center'
                                }}>
                                    <Text style={{ fontWeight: '500', fontSize: 12, color: '#FFFFFF' }}>{item.serialNumber}</Text>
                                </View>
                            )
                                : null}
                        </TouchableOpacity>
                    )}
                    ListHeaderComponent={() => (
                        <View style={{ flexDirection: 'row', height: 45, justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 }}>
                            <TouchableOpacity activeOpacity={1} style={{ flexDirection: 'row' }}>
                                <Text style={{ fontWeight: '600', fontSize: 16, color: '#FFFFFF' }}>Galerie</Text>
                                <Image resizeMode="contain" style={{ marginLeft: 10, width: 15, height: 15, tintColor: '#FFFFFF' }} source={require('./assets/down_a.png')} />
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row' }}>
                                {/* <TouchableOpacity onPress={() => this.setState({ multipleSelected: !this.state.multipleSelected })} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: !this.state.multipleSelected ? 'rgba(255,255,255,0.2)' : '#2473f0', height: 35, width: 35, borderRadius: 100, marginRight: 8 }}>
                                    <Image resizeMode="contain" style={{ width: 22, height: 22, tintColor: '#FFFFFF' }} source={require('./assets/multi-copy.png')} />
                                </TouchableOpacity> */}
                                <TouchableOpacity onPress={this.camera} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', height: 35, width: 35, borderRadius: 100 }}>
                                    <Image resizeMode="contain" style={{ width: 20, height: 20, tintColor: '#FFFFFF' }} source={require('./assets/camera.png')} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            </View>
        );
    }
}
