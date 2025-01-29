import {
  Heading,
  View,
  Button,
  Flex,
} from "@aws-amplify/ui-react";
import LearningPathsTable from "./LearningPathsTable";
import { useNavigate } from "react-router-dom";

const LearningPaths = () => {
  const navigate = useNavigate();
  return (
    <>
        <View padding="1rem">
        <Flex justifyContent="space-between">
                <Heading level={1}>Learning Paths</Heading>
                <Button onClick={() => navigate("/add-learning-path")}>Add Learning Path</Button>
            </Flex>
        </View>
        <LearningPathsTable />
    </>
  );
};

export default LearningPaths;
