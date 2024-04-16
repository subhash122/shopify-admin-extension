import { useEffect, useState } from 'react';
import {
  reactExtension,
  useApi,
  AdminAction,
  BlockStack,
  Button,
  Text,
  TextField,
  PasswordField,
  EmailField,
  Form,

} from '@shopify/ui-extensions-react/admin';
import './action.css'
// The target used here must match the target used in the extension's toml file (./shopify.extension.toml)
const TARGET = 'admin.product-details.action.render';

export default reactExtension(TARGET, () => <App />);

function App() {
  // The useApi hook provides access to several useful APIs like i18n, close, and data.
  const { i18n, close, data } = useApi(TARGET);
  console.log({ data });
  const [productTitle, setProductTitle] = useState('');
  const [userDetails, setuserDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    integratorId: "",
    password: "",
    confirmPassword: '',
  });
  const [emailError, setEmailError] = useState('');

  // Use direct API calls to fetch data from Shopify.
  // See https://shopify.dev/docs/api/admin-graphql for more information about Shopify's GraphQL API
  useEffect(() => {
    (async function getProductInfo() {
      const getProductQuery = {
        query: `query Product($id: ID!) {
          product(id: $id) {
            title
          }
        }`,
        variables: { id: data.selected[0].id },
      };

      const res = await fetch("shopify:admin/api/graphql.json", {
        method: "POST",
        body: JSON.stringify(getProductQuery),
      });

      if (!res.ok) {
        console.error('Network error');
      }

      const productData = await res.json();
      setProductTitle(productData.data.product.title);
    })();
  }, [data.selected]);

  const handleSubmit = async () => {

    try {
      const res = await fetch("https://d3b3-2409-40d2-4c-fa21-a18b-64ee-734f-2cdb.ngrok-free.app/userdetails", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userDetails),
      });

      setuserDetails({
        firstName: "",
        lastName: "",
        email: "",
        integratorId: "",
        password: "",
        confirmPassword: '',
      })
    } catch (error) {
      console.log(error)
    }

  }
  const handleFnameChanged = (value) => {
    setuserDetails({ ...userDetails, firstName: value });
  }
  const handleLnameChanged = (value) => {
    setuserDetails({ ...userDetails, lastName: value });
  }
  const handleEmailChanged = (value) => {
    setuserDetails({ ...userDetails, email: value });
  }
  const handleIdChanged = (value) => {
    setuserDetails({ ...userDetails, integratorId: value });
  }
  const handlePasswordChanged = (value) => {
    setuserDetails({ ...userDetails, password: value });
  }
  const handleConfirmPasswordChanged = (value) => {
    setuserDetails({ ...userDetails, confirmPassword: value });
  }
  const validateEmail = () => {
    if (!userDetails.email) {
      setEmailError('Email is required');
    } else {
      setEmailError('');
    }
  };
  return (
    // The AdminAction component provides an API for setting the title and actions of the Action extension wrapper.
    <AdminAction
      primaryAction={
        <Button
          onPress={() => {
            console.log('saving');
            close();
          }}
        >
          Done
        </Button>
      }
      secondaryAction={
        <Button
          onPress={() => {
            console.log('closing');
            close();
          }}
        >
          Close
        </Button>
      }
    >

      <Form >
        {/* Set the translation values for each supported language in the locales directory */}
        <TextField label="First Name" value={userDetails.firstName} onChange={handleFnameChanged} />
        <TextField label="Last Name" value={userDetails.lastName} onChange={handleLnameChanged} />
        <EmailField label="Email" value={userDetails.email} onChange={handleEmailChanged}
          onBlur={validateEmail} error={emailError} />
        <TextField label="Integrator id" value={userDetails.integratorId} onChange={handleIdChanged} />
        <PasswordField label="Password" value={userDetails.password} onChange={handlePasswordChanged} />
        <PasswordField label="Confirm password" value={userDetails.confirmPassword} onChange={handleConfirmPasswordChanged} />
        <Button  variant="primary" onClick={handleSubmit}>Sign Up</Button>
      </Form>
    </AdminAction>
  );
}