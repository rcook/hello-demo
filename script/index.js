const Util = {
  log: str => {
    const e = $("<p>");
    e.text(str);
    $("#console").append(e);
  }
};

function Auth(hello, networks) {
  function signIn(networkId) {
    hello(networkId)
      .login({
        response_type: "token id_token",
        scope: "https://www.googleapis.com/auth/userinfo.profile, https://www.googleapis.com/auth/userinfo.email",
        force: true
      })
      .then(() => Util.log("signed in"))
      .then(refreshUI)
      .catch(e => alert(JSON.stringify(e)));
  }

  function signOut(networkId) {
    hello(networkId)
      .logout()
      .then(() => Util.log("signed out"))
      .then(refreshUI)
      .catch(e => alert(JSON.stringify(e)));
  }

  function isSessionSignedIn(session) {
    const currentTime = (new Date()).getTime() / 1000;
    return session && session.access_token && session.expires > currentTime;
  }

  function refreshUI() {
    const authState = $("#auth-state");
    authState.empty();

    const buttons = $("#buttons");
    buttons.empty();

    for (const networkId of Object.keys(networks)) {
      const network = networks[networkId];
      const displayName = network.displayName;
      const isSignedIn = isSessionSignedIn(hello(networkId).getAuthResponse());

      const p = $("<p>");
      p.text(isSignedIn ? `Signed in to ${displayName}` : `Not signed in to ${displayName}`);
      authState.append(p);

      if (isSignedIn) {
        const signOutButton = $("<button>");
        signOutButton.text(`Sign out of ${displayName}`);
        signOutButton.click(() => signOut(networkId));
        buttons.append(signOutButton);
        buttons.append($("<br>"));
      }
      else {
        const signInButton = $("<button>");
        signInButton.text(`Sign in to ${displayName}`);
        signInButton.click(() => signIn(networkId));
        buttons.append(signInButton);
        buttons.append($("<br>"));
      }
    }
  }

  function makeInitializer(networks) {
    const initializer = {};
    for (const key of Object.keys(networks)) {
      initializer[key] = networks[key].clientId;
    }

    return initializer;
  }

  refreshUI();

  hello.init(makeInitializer(networks));

  hello.on("auth.login", auth => {
    hello(auth.network).api("me").then(response => Util.log(`fetched user data: id=${response.id} name=${response.name} email=${response.email}`));
  });
}

(hello => {
  $(() => {
    $.get("/data/google-api-client-id.txt")
      .then(response => new Auth(hello, {
        google_oauth2: {
          displayName: "Google",
          clientId: response.trim()
        }
      }))
      .catch(e => alert(JSON.stringify(e)));
  });
})(hello);
