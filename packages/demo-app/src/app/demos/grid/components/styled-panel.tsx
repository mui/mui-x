import styled from 'styled-components';

export const StyledPanels = styled.div`
  background-color: ${props => props.theme.colors.backgroundLight};

  .panel {
    padding: 20px;
    background-color: ${props => props.theme.colors.panelBackground};
    color: ${props => props.theme.colors.text};
    .panel-title {
      background-color: ${props => props.theme.colors.panelTitleBg};
      color: ${props => props.theme.colors.panelTitle};
    }

    .panel-content {
      position: relative;
    }

    .dataset-control {
      .MuiFormLabel-root,
      .MuiFormControlLabel-label {
        font-size: 12px;
      }
    }
    .input-text {
      margin: 5px;
      width: 100px;

      .MuiInputBase-root {
        font-size: 12px;
      }

      input {
        color: ${p => p.theme.colors.text};
      }
      .MuiFormLabel-root {
        color: ${p => p.theme.colors.label};

        &.Mui-focused {
          color: ${p => p.theme.colors.app};
        }
      }
    }
    .apply-btn {
      margin-left: 15px;
      margin-top: 5px;
    }
    .switch {
      display: none;
      color: ${p => p.theme.colors.text};
      font-size: 12px;

      & label: {
        font-size: 12px;
      }
    }
    .action-button-bar {
      padding: 10px;
      align-items: center;
      flex-direction: row;
      display: flex;
      justify-content: center;

      & button {
        margin-right: 10px;
      }
    }
  }
`;
