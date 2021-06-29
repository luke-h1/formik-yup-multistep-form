import { Button, Card, CardContent } from "@material-ui/core";
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
          initialValues={{
            firstName: "",
            lastName: "",
            millionaire: false,
            money: 0,
            description: "",
          }}
          onSubmit={() => {}}
        >
          <FormikStep>
            <Field name="firstName" component={TextField} label="First Name" />
            <Field name="lastName" component={TextField} label="Last Name" />
            <Field
              name="millionaire"
              component={CheckboxWithLabel}
              Label={{ label: "I am a millionaire" }}
              type="checkbox"
            />
          </FormikStep>
          <FormikStep
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
          >
            <Field
              name="money"
              component={TextField}
              label="money"
              type="number"
            />
          </FormikStep>
          <FormikStep>
            <Field
              name="description"
              component={TextField}
              label="All the money you have"
            />
          </FormikStep>
        </FormikStepper>
      </CardContent>
    </Card>
  );
}

export interface FormikStepProps
  extends Pick<FormikConfig<FormikValues>, "children" | "validationSchema"> {}

export function FormikStep({ children, ...props }: FormikStepProps) {
  return <>{children}</>;
}

export function FormikStepper({
  children,
  ...props
}: FormikConfig<FormikValues>) {
  // Allow us to only show steps we want by splitting the children into an array
  const childrenArray = React.Children.toArray(
    children
  ) as React.ReactElement<FormikStepProps>[];
  const [step, setStep] = useState(0);
  const currentChild = childrenArray[step];
  console.log('currentChild:', currentChild)

  function isLastStep() {
    return step === childrenArray.length - 1;
  }

  return (
    <Formik
      {...props}
      onSubmit={async (values, helpers) => {
        // if we're on the last step of the form
        if (isLastStep()) {
          await props.onSubmit(values, helpers);
        } else {
          setStep((s) => s + 1);
        }
      }}
    >
      <Form autoCapitalize="off">
        {currentChild}
        {step > 0 ? (
          <Button onClick={() => setStep((s) => s - 1)}>Back</Button>
        ) : null}
        <Button type="submit">{isLastStep() ? "Submit" : "Next"}</Button>
      </Form>
    </Formik>
  );
}
