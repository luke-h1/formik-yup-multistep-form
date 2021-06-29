import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Step,
  StepLabel,
  Stepper,
} from "@material-ui/core";
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

const Sleep = (time: number) => new Promise((acc) => setTimeout(acc, time));

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
          onSubmit={async (values) => {
            await Sleep(3000);
            console.log("values", values);
          }}
        >
          <FormikStep label="Step 1">
            <Box paddingBottom={2}>
              <Field
                fullWidth
                name="firstName"
                component={TextField}
                label="First Name"
              />
            </Box>
            <Box paddingBottom={2}>
              <Field
                fullWidth
                name="lastName"
                component={TextField}
                label="Last Name"
              />
            </Box>
            <Box paddingBottom={2}>
              <Field
                name="millionaire"
                component={CheckboxWithLabel}
                Label={{ label: "I am a millionaire" }}
                type="checkbox"
              />
            </Box>
          </FormikStep>
          <FormikStep
            label="Step 2"
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
            <Box paddingBottom={2}>
              <Field
                fullWidth
                name="money"
                component={TextField}
                label="money"
                type="number"
              />
            </Box>
          </FormikStep>
          <FormikStep label="Step 3">
            <Box paddingBottom={2}>
              <Field
                name="description"
                component={TextField}
                label="Description"
              />
            </Box>
          </FormikStep>
        </FormikStepper>
      </CardContent>
    </Card>
  );
}

export interface FormikStepProps
  extends Pick<FormikConfig<FormikValues>, "children" | "validationSchema"> {
  label: string;
}

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
  const currentChild = childrenArray[
    step
  ] as React.ReactElement<FormikStepProps>;
  const [completed, setCompleted] = useState<boolean>(false);

  console.log("currentChild:", currentChild.props.validationSchema);

  function isLastStep() {
    return step === childrenArray.length - 1;
  }

  return (
    <Formik
      {...props}
      validationSchema={currentChild.props.validationSchema}
      onSubmit={async (values, helpers) => {
        // if we're on the last step of the form
        if (isLastStep()) {
          await props.onSubmit(values, helpers);
          setCompleted(true);
        } else {
          setStep((s) => s + 1);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form autoCapitalize="off">
          <Stepper alternativeLabel activeStep={step}>
            {childrenArray.map((child, i) => (
              <Step key={child.props.label} completed={step > i || completed}>
                <StepLabel>{child.props.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {currentChild}

          <Grid container spacing={2}>
            <Grid item>
              {step > 0 ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setStep((s) => s - 1)}
                  disabled={isSubmitting}
                >
                  Back
                </Button>
              ) : null}
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size='1rem' /> : null}
              >
                {isSubmitting ? "Submitting" : isLastStep() ? "Submit" : "Next"}
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}
