import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import { TreeViewSelectionPropagation } from '@mui/x-tree-view/models';
import PlaygroundTreeView from './PlaygroundTreeView';
import ThemeConfig, { Corner, Density } from './PlaygroundThemeConfig';

export default function MainDemo() {
  const docsTheme = useTheme();
  const isMd = useMediaQuery(docsTheme.breakpoints.up('md'));
  const [color, setColor] = React.useState<string>('default');
  const [corner, setCorner] = React.useState<Corner>('medium');
  const [density, setDensity] = React.useState<Density>('medium');
  const [showFolderIcon, setShowFolderIcon] = React.useState<boolean>(false);
  const [showChildrenOutline, setShowChildrenOutline] = React.useState<boolean>(false);
  const [showDisableButton, setShowDisableButton] = React.useState<boolean>(false);
  const [showSecondaryLabel, setShowSecondaryLabel] = React.useState<boolean>(false);
  const [isMultiSelectEnabled, setIsMultiSelectEnabled] = React.useState<boolean>(false);
  const [isCheckboxSelectionEnabled, setIsCheckboxSelectionEnabled] =
    React.useState<boolean>(false);
  const [selectionPropagation, setSelectionPropagation] =
    React.useState<TreeViewSelectionPropagation>({
      parents: false,
      descendants: false,
    });

  const [openDrawer, setOpenDrawer] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpenDrawer(newOpen);
  };

  const handleChangeCorner = (_event: React.MouseEvent<HTMLElement>, newCorner: Corner) => {
    if (newCorner !== null) {
      setCorner(newCorner);
    }
  };

  const handleChangeColor = (_event: React.MouseEvent<HTMLElement>, newColor: string) => {
    if (newColor !== null) {
      setColor(newColor);
    }
  };
  const handleChangeDensity = (_event: React.MouseEvent<HTMLElement>, newDensity: Density) => {
    if (newDensity !== null) {
      setDensity(newDensity);
    }
  };
  const handleToggleFolderIcon = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowFolderIcon(event.target.checked);
  };
  const handleToggleChildrenOutline = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowChildrenOutline(event.target.checked);
  };
  const handleToggleDisableButton = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowDisableButton(event.target.checked);
  };
  const handleToggleSecondaryLabel = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowSecondaryLabel(event.target.checked);
  };
  const handleToggleCheckboxSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsCheckboxSelectionEnabled(event.target.checked);
  };
  const handleToggleMultiSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsMultiSelectEnabled(event.target.checked);
  };

  const treeViewProps = {
    color,
    corner,
    density,
    showFolderIcon,
    showChildrenOutline,
    showDisableButton,
    showSecondaryLabel,
    isCheckboxSelectionEnabled,
    isMultiSelectEnabled,
    selectionPropagation,
  };

  const themeConfigProps = {
    ...treeViewProps,
    handleChangeCorner,
    handleChangeColor,
    handleChangeDensity,
    handleToggleFolderIcon,
    handleToggleChildrenOutline,
    handleToggleDisableButton,
    handleToggleSecondaryLabel,
    handleToggleCheckboxSelection,
    handleToggleMultiSelect,
    setSelectionPropagation,
  };

  return (
    <React.Fragment>
      <Divider />
      <Stack spacing={4} py={8} alignItems="center">
        <Stack spacing={1} sx={{ width: '100%', maxWidth: { xs: '500px', md: '100%' } }}>
          {/* eslint-disable-next-line material-ui/no-hardcoded-labels */}
          <Typography variant="body2" color="primary" fontWeight="semiBold" textAlign="center">
            Customization
          </Typography>
          <Typography
            variant="h4"
            component="h2"
            fontWeight="semiBold"
            color="text.primary"
            textAlign="center"
            // eslint-disable-next-line material-ui/no-hardcoded-labels
          >
            Superior developer experience for customization
          </Typography>
          {/* eslint-disable-next-line material-ui/no-hardcoded-labels */}
          <Typography variant="body1" color="text.secondary" textAlign="center">
            Intuitive APIs, a modern customization approach, and detailed documentation make it
            effortless to tailor the component to your specific use case.
          </Typography>
        </Stack>
        {!isMd && (
          <Button
            variant="contained"
            onClick={toggleDrawer(true)}
            startIcon={<SettingsSuggestIcon />}
            /* eslint-disable-next-line material-ui/no-hardcoded-labels */
          >
            Customize
          </Button>
        )}

        <Paper
          component="div"
          variant="outlined"
          sx={(theme) => ({
            mb: 8,
            height: 640,
            width: '100%',
            overflow: 'hidden',
            display: 'flex',
            backgroundImage: `linear-gradient(${theme.palette.divider} 1px, transparent 1px), linear-gradient(to right,${theme.palette.divider} 1px, ${theme.palette.background.paper} 1px)`,
          })}
        >
          <PlaygroundTreeView {...treeViewProps} />

          {isMd ? (
            <ThemeConfig {...themeConfigProps} />
          ) : (
            <Drawer anchor="bottom" open={openDrawer} onClose={toggleDrawer(false)}>
              <ThemeConfig {...themeConfigProps} />
            </Drawer>
          )}
        </Paper>
      </Stack>
    </React.Fragment>
  );
}
