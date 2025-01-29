import { View, Flex, Text, Button, useTheme } from "@aws-amplify/ui-react";
import { useParams } from 'react-router-dom';
import SchoolsTable from './SchoolsTable';
import LearningPathsTable from "./LearningPathsTable";
import { useLab } from "../../hooks/useLab";
import { useNavigate } from "react-router-dom";

const Module = () => {
    const { tokens } = useTheme();
    const navigate = useNavigate();
    const { moduleId = '' } = useParams<{ moduleId: string }>()
    const lab = useLab(String(moduleId));
    return (
        <>
            <View maxWidth="100%" padding="0rem" minHeight="100vh">
                <View paddingTop="1rem" paddingBottom="1rem">
                    <Flex
                        direction={{ base: "column", large: "row" }}
                        alignItems="flex-start"
                        backgroundColor={tokens.colors.background.primary.value}
                    >
                        <div className="profile-header-text">
                        <Text variation="primary" fontWeight={600} fontSize="18px">
                            {lab?.lab?.name}
                        </Text>
                        <Text variation="tertiary">{lab?.lab?.description}</Text>
                        </div>
                    </Flex>
                </View>
                <View paddingTop="1rem" paddingBottom="1rem">
                    <Text variation="primary" fontWeight={600} fontSize="18px">
                        Schools
                    </Text>
                    <Button onClick={() => navigate(`/update-module-school/${moduleId}`)}>Associate School</Button>
                    <SchoolsTable labId={Number(moduleId)} />
                </View>
                <View paddingTop="1rem" paddingBottom="1rem">
                    <Text variation="primary" fontWeight={600} fontSize="18px">
                        Learning Paths
                    </Text>
                    <Button onClick={() => navigate(`/update-module-learning-path/${moduleId}`)}>Associate Learning Path</Button>
                    <LearningPathsTable labId={Number(moduleId)} />
                </View>
            </View>
        </>
    );
};

export default Module;
