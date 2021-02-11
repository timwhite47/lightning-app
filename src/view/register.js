import React from 'react';
import { StyleSheet, View } from 'react-native';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { SplitBackground } from '../component/background';
import MainContent from '../component/main-content';
import Button, { GlasButton, PillButton } from '../component/button';
import { color, font } from '../component/style';
import { InputField } from '../component/field';
import Card from '../component/card';
import { FormStretcher } from '../component/form';
import PasswordEntry from '../component/password-entry';
import { H1Text } from '../component/text';

//
// CoinZen Registration
//

const styles = StyleSheet.create({
  content: {
    justifyContent: 'flex-end',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginTop: 5,
    marginBottom: 5,
    padding: 5,
  },
  card: {
    maxHeight: 500,
    maxWidth: 680,
    paddingLeft: 45,
    paddingRight: 45,
    paddingBottom: 50,
  },
  newCopy: {
    marginTop: 10,
    maxWidth: 250,
    color: color.blackText,
    height: font.lineHeightSub * 2,
  },
});

const RegistrationView = ({
  store: {
    settings: {
      authentication: { email, username },
    },
  },
  registration,
}) => (
  <SplitBackground image="purple-gradient-bg" bottom={color.blackDark}>
    <MainContent style={styles.content}>
      <View>
        <H1Text style={styles.title}>{'Register'}</H1Text>
      </View>
      <Card style={styles.card}>
        <FormStretcher>
          <InputField
            style={styles.input}
            placeholder="Username"
            autoFocus={true}
            value={username}
            onChangeText={username => registration.setUsername({ username })}
          />
          <InputField
            style={styles.input}
            placeholder="Email Address"
            value={email}
            onChangeText={email => registration.setEmail({ email })}
          />
          <PasswordEntry
            style={styles.input}
            placeholder="Password"
            onChangeText={password => registration.setPassword({ password })}
          />
          <PasswordEntry
            style={styles.input}
            placeholder="Password Confirmation"
            onChangeText={password =>
              registration.setPasswordVerify({ password })
            }
          />
        </FormStretcher>
        <PillButton onPress={() => registration.register()}>
          Register
        </PillButton>
      </Card>
    </MainContent>
  </SplitBackground>
);

RegistrationView.propTypes = {
  store: PropTypes.object.isRequired,
  registration: PropTypes.object.isRequired,
};

export default observer(RegistrationView);
