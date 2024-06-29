import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { Button } from "react-native";
import axios from "axios";

WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID = process.env.DISCORD_CLIENT_ID
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET
const API_ENDPOINT = "https://discord.com/api/v10";
const SCOPES = [
  "identify",
  "email",
  // "connections",
  // "applications.commands",
  // "applications.commands.update",
  "activities.read",
  "activities.write",
];

const discovery = {
  authorizationEndpoint: "https://discord.com/api/oauth2/authorize",
  tokenEndpoint: "https://discord.com/api/oauth2/token",
};

const redirectUri = makeRedirectUri({
  // useProxy: true,//seems to not work
  path: "profile",
});

const Profile = () => {
  // @ts-ignore
  // console.log("Link", Linking.createURL());
  // console.log("Redirect", redirectUri);

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: SCOPES,
      // prompt: "consent",
      // usePKCE: false, //seems to be failing
      redirectUri,
    },
    discovery
  );
  console.log("response", response);
  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      const codeVerifier = request?.codeVerifier;
      console.log("request", request);
      console.log("response", response);
      console.log("Code", code);
      getTokens(code, codeVerifier);
    }
  }, [response]);

  const getTokens = async (code: string, codeVerifier: string | undefined) => {
    try {
      const result = await axios.post(
        `${API_ENDPOINT}/oauth2/token`,
        {
          client_id: CLIENT_ID,
          // client_secret: CLIENT_SECRET, // not required here
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri,
          code_verifier: codeVerifier,
          // scope: "identify email",
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      // refreshAccessToken(result.data.refresh_token);// will be used when the access token have failed or expired
      console.log("result", result.data);
    } catch (error) {
      console.error("error", error, error.response.data);
    }
  };

  const refreshAccessToken = async (refreshToken: string) => {
    try {
      const result = await axios.post(
        `${API_ENDPOINT}/oauth2/token`,
        {
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET, // it seems it is required here
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          redirect_uri: redirectUri,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      console.log("result using the refresh token", result.data);
    } catch (error) {
      console.error("error 2", error, error.response.data);
    }
  };

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-3xl">Profile</Text>
      <Button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={!request}
        title="Login"
        onPress={() => {
          promptAsync();
        }}
      />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});
