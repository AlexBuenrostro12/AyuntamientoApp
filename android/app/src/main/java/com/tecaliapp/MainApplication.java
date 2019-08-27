package com.tecaliapp;

import android.app.Application;

import com.RNFetchBlob.RNFetchBlobPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.imagepicker.ImagePickerPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
import com.rnfs.RNFSPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.vonovak.AddCalendarEventPackage;

import org.wonday.pdf.RCTPdfView;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new FIRMessagingPackage(),
            new MainReactPackage(),
            new ReanimatedPackage(),
            new RNFSPackage(),
            new PickerPackage(),
            new AddCalendarEventPackage(),
            new RNGestureHandlerPackage(),
            new RNFetchBlobPackage(),
            new ReactNativeDocumentPicker(),
            new MapsPackage(),
            new AsyncStoragePackage(),
            new RCTPdfView(),
            new ImagePickerPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
        return "index";
      }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
    }

    // react-native-fcm
    @Override
    public void onCreate() { // <-- Check this block exists
      super.onCreate();
      SoLoader.init(this, /* native exopackage */ false); // <-- Check this line exists within the block
    }
}
