import { Card, CardContent } from "@material-ui/core";
import React, { useState } from "react";
import { Formik, Form, Field, FormikConfig, FormikValues } from "formik";
import { TextField, CheckboxWithLabel } from "formik-material-ui";
import { number, mixed, object } from "yup";
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
        <FormikStepper
          validationSchema={object({
            money: mixed().when("millionaire", {
              is: true,
              then: number()
                .required()
                .min(
                  1_000_000,
                  "Because you said you are a millionaire you need to have 1 million"
                ),
              otherwise: number().required(),
            }),
          })}
          initialValues={{
            firstName: "",
            lastName: "",
            millionaire: false,
            money: 0,
            description: "",
          }}
          onSubmit={() => {}}
        >
            <div>
              <Field
                name="firstName"
                component={TextField}
                label="First Name"
              />
              <Field name="lastName" component={TextField} label="Last Name" />
              <Field
                name="millionaire"
                component={CheckboxWithLabel}
                Label={{ label: "I am a millionaire" }}
                type="checkbox"
              />
            </div>
            <div>
              <Field
                name="money"
                component={TextField}
                label="money"
                type="number"
              />
            </div>
            <div>
              <Field
                name="description"
                component={TextField}
                label="All the money you have"
              />
            </div>
        </FormikStepper>
      </CardContent>
    </Card>
  );
}
export function FormikStepper({
  children,
  ...props
}: FormikConfig<FormikValues>) {
  // Allow us to only show steps we want by splitting the children into an array
  const childrenArray = React.Children.toArray(children);
  const [step, setStep] = useState(0);
  const currentChild = childrenArray[step];

  return (
    <Formik {...props} onSubmit={() => {}}>
      <Form autoCapitalize="off">{currentChild}</Form>
    </Formik>
  );
}
