import {
    View,
    Flex,
    useTheme,
    Table,
    TableCell,
    TableBody,
    TableHead,
    TableRow,
    Text,
} from "@aws-amplify/ui-react";
import { useParams } from 'react-router-dom';
import { useLearningPath } from "../../hooks/useLearningPath";
import { usePathLabs } from "../../hooks/usePathLabs";
import { useNavigate } from "react-router-dom";

const LearningPath = () => {
  const { tokens } = useTheme();
  const { pathId = '' } = useParams<{ pathId: string }>()
  const learningPath = useLearningPath(pathId);
  const modules = usePathLabs(Number(pathId));
  const navigate = useNavigate();
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
                {learningPath?.learning_path?.name}
              </Text>
              <Text variation="tertiary">{learningPath?.learning_path?.description}</Text>
            </div>
          </Flex>
        </View>
        <View>
          <Table
            backgroundColor={tokens.colors.background.primary.value}
            caption=""
            highlightOnHover={true}
            // variation="striped"
          >
            <TableHead>
                <TableRow>
                    <TableCell as="th">Name</TableCell>
                    <TableCell as="th">Description</TableCell>
                    <TableCell as="th">CloudShare Training ID</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {modules?.labs?.labs?.sort((a, b) => a.name.localeCompare(b.name))?.map((module) => {
                return (
                    <TableRow key={module.id}>
                        <TableCell
                          onClick={() => navigate(`/modules/${module.id}`)}
                          style={{ cursor: "pointer" }}
                        >
                          {module.name}
                        </TableCell>
                        <TableCell>{module.description}</TableCell>
                        <TableCell
                            onClick={() => window.open(`https://accelerate.cloudshare.com/training/${module.cloudshare_training_id}`)}
                            style={{ cursor: "pointer" }}
                            >
                            {module.cloudshare_training_id}
                      </TableCell>
                    </TableRow>
                );
                })}
            </TableBody>
          </Table>
        </View>
      </View>
    </>
  );
};

export default LearningPath;
