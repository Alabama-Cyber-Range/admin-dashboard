import {
  useTheme,
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  Button,
} from "@aws-amplify/ui-react";

import { useLabSchools } from '../../hooks/useLabSchools';
import { School } from '@admin-dashboard/contracts/School';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { unassociate_lab_with_school } from "../../services/api"
import { useQueryClient } from "@tanstack/react-query";

export interface LabData {
  labId: number;
}

const SchoolsTable = (props: LabData) => {
  const { tokens } = useTheme();
  const labId  = props.labId;
  const data = useLabSchools(labId);
    useEffect(() => {}
    , [data]);
  const navigate = useNavigate();

  const queryClient = useQueryClient()

  const handleDelete = async (schoolId: number) => {
    event?.preventDefault
    await unassociate_lab_with_school(labId, schoolId);
    await queryClient.invalidateQueries({ queryKey: ['labSchools', labId] })
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
          {data?.schools?.schools?.sort((a, b) => a.name.localeCompare(b.name))?.map((item: School) => {
            return (
              <TableRow key={item.id}>
                <TableCell
                  onClick={() => navigate(`/schools/${item.id}`)}
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

export default SchoolsTable;
