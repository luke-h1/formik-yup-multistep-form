import {
  Card,
  CardContent,
} from "@material-ui/core";
import React from "react";
import { Formik, Form, Field } from "formik";
import { TextField, CheckboxWithLabel} from 'formik-material-ui';

interface FormValues {
  firstName: string;
  lastName: string;
  millionaire: boolean;
  money: number;
  description: string;
}

export default function Home() {
  return (
    <Card>
      <CardContent>
        <Formik<FormValues>
          initialValues={{
            firstName: "",
            lastName: "",
            millionaire: false,
            money: 0,
            description: "",
          }}
          onSubmit={() => {}}
        >
          <Form>
            <Field name="firstName" component={TextField} label="First Name" />
            <Field name="lastName" component={TextField} label="Last Name" />
            <Field
              name="millionaire"
              component={CheckboxWithLabel}
              Label={{ label: "Checkbox" }}
            />
            <Field
              name="money"
              component={TextField}
              label="money"
              type="number"
            />
            <Field
              name="description"
              component={TextField}
              label="All the money you have"
            />
          </Form>
        </Formik>
      </CardContent>
    </Card>
  );
}
