import {
  useTheme,
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  Button,
} from "@aws-amplify/ui-react";

import { useLabLearningPaths } from '../../hooks/useLabLearningPaths';
import { LearningPath } from '@admin-dashboard/contracts/LearningPath';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { unassociate_lab_with_learning_path } from "../../services/api"
import { useQueryClient } from "@tanstack/react-query";

export interface LabData {
  labId: number;
}

const LearningPathsTable = (props: LabData) => {
  const { tokens } = useTheme();
  const labId  = props.labId;
  const data = useLabLearningPaths(labId);
    useEffect(() => {}
    , [data]);
  const navigate = useNavigate();

  const queryClient = useQueryClient()

  const handleDelete = async (learningId: number) => {
    event?.preventDefault
    await unassociate_lab_with_learning_path(labId, learningId);
    await queryClient.invalidateQueries({ queryKey: ['labLearningPaths', labId] })
  };

  return (
    <>
      <Table
        caption=""
        highlightOnHover={true}
        backgroundColor={tokens.colors.background.primary.value}
        // variation="striped"
        >
        <TableHead>
          <TableRow>
            <TableCell as="th">Name</TableCell>
            <TableCell as="th" align="right"></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data?.learningPaths?.learningPaths?.sort((a, b) => a.name.localeCompare(b.name))?.map((item: LearningPath) => {
            return (
              <TableRow key={item.id}>
                <TableCell
                  onClick={() => navigate(`/learning-paths/${item.id}`)}
                  style={{ cursor: "pointer" }}
                  >{item.name}
                </TableCell>
                <TableCell align="right" style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                  onClick={() => handleDelete(Number(item.id))}
                    >Unassociate
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default LearningPathsTable;
