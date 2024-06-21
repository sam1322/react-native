import { Text, View } from "react-native";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";
import tw from "twrnc";

const RootLayout = () => {
  return (
    <View style={tw`flex-1 items-center justify-center bg-white p-10`}>
      {/* <Text style={tw`text-3xl`}>Aora!</Text> */}
      <Text className={"text-3xl font-pblack "}>Aora!</Text>
      <StatusBar style="auto" />
      <Link href="/profile" style={{ color: "blue" }}>
        Go to Profile
      </Link>
    </View>
  );
};

export default RootLayout;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 20,
//   },
// });
