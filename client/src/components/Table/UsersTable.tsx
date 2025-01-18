import {
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
  Button,
} from "@aws-amplify/ui-react";

import { useUsers } from "../../hooks/useUsers";
import { User } from '@admin-dashboard/contracts/User';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ModulesTable = () => {
  const data = useUsers();
    useEffect(() => {}
    , [data]);
  const navigate = useNavigate();
  return (
    <>
      <Table caption="" highlightOnHover={false}>
        <TableHead>
          <TableRow>
            <TableCell as="th">First Name</TableCell>
            <TableCell as="th">Last Name</TableCell>
            <TableCell as="th">Username</TableCell>
            <TableCell as="th">Email</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data?.users?.users?.map((item: User) => {
            return (
              <TableRow key={item.id}>
                <TableCell>{item.first_name}</TableCell>
                <TableCell>{item.last_name}</TableCell>
                <TableCell>{item.cognito_id}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>
                  <Button onClick={() => navigate("/edit-form")}>Edit</Button>
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
