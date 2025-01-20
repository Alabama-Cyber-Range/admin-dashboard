import { View, Flex, Text, useTheme } from "@aws-amplify/ui-react";
// import ProfileInformation from "./ProfileInformation";

const UserHeader = () => {
//   const user = useUser();
//   useEffect(() => {}
//   , [user]);
  return (
    <>
      <Flex
        direction={{ base: "column", large: "row" }}
        alignItems="flex-start"
      >
        <div className="profile-header-image">
        </div>
        <div className="profile-header-text">
          <Text variation="primary" fontWeight={600} fontSize="18px">
            Chase Golden
          </Text>
          <Text variation="tertiary">chase.golden@bofa.org</Text>
        </div>
      </Flex>
    </>
  );

};

const User = () => {
  const { tokens } = useTheme();
  return (
    <>
      <div>
        <h2>User</h2>
      </div>
      <View maxWidth="100%" padding="0rem" minHeight="100vh">
        <Flex
          direction={{ base: "column", large: "row" }}
          alignItems="flex-start"
          gap={tokens.space.xl}
          marginBottom="30px"
        >
          <View
            backgroundColor="var(--amplify-colors-white)"
            borderRadius="6px"
            width={{ base: "100%", large: "100%" }}
            padding="1rem"
          >
            <UserHeader />
          </View>
        </Flex>

        <Flex
          direction={{ base: "column", large: "row" }}
          gap={tokens.space.xl}
          alignItems="flex-start"
        >
          {/* <View
            backgroundColor="var(--amplify-colors-white)"
            borderRadius="6px"
            width={{ base: "100%", large: "40%" }}
            padding={{ base: "1em", large: "1.5rem" }}
          > */}
            {/* <ProfileInformation /> */}
          {/* </View> */}
        </Flex>
      </View>
    </>
  );
};

export default User;