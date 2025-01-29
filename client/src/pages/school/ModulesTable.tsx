import {
  useTheme,
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
} from "@aws-amplify/ui-react";

import { useSchoolLabs } from '../../hooks/useSchoolLabs';
import { Lab } from '@admin-dashboard/contracts/Lab';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export interface SchoolData {
  schoolId: number;
}

const ModulesTable = (props: SchoolData) => {
  const { tokens } = useTheme();
  const schoolId  = props.schoolId;
  const data = useSchoolLabs(schoolId);
    useEffect(() => {}
    , [data]);
  const navigate = useNavigate();
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
            <TableCell as="th">Description</TableCell>
            <TableCell as="th">CloudShare Training ID</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data?.labs?.labs?.sort((a, b) => a.name.localeCompare(b.name))?.map((item: Lab) => {
            return (
              <TableRow key={item.id}>
                <TableCell
                  onClick={() => navigate(`/modules/${item.id}`)}
                  style={{ cursor: "pointer" }}
                  >{item.name}
                </TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell
                    onClick={() => window.open(`https://accelerate.cloudshare.com/training/${item.cloudshare_training_id}`)}
                    style={{ cursor: "pointer" }}
                    >
                    {item.cloudshare_training_id}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </>
  );
};

export default ModulesTable;
