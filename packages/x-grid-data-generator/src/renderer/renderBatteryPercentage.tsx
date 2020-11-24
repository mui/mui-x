import * as React from 'react';
import clsx from 'clsx';
import { CellParams } from '@material-ui/x-grid';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '98%',
            border: `4px solid ${theme.palette.divider}`,
            height: '3.5ch',
            margin: '4px 0 4px 0',
            marginTop: '4px',
            marginRight: '0ch',
            marginBottom: '4px',
            marginLeft: '0ch',
            position: 'relative',
            borderRadius: '4px',
            boxSizing: 'border-box',
            '-moz-box-sizing': 'border-box',
            '-webkit-box-sizing': 'border-box',
            display: 'flex',
            alignItems: 'center', /* vertical */
            justifyContent: 'center', /* horizontal */

            '&::before': {
                right: '-8px',
                width: '4px',
                height: '100%',
                content: '""',
                display: 'block',
                position: 'absolute',
                background: `${theme.palette.divider}`,
                borderRadius: '0 6px 6px 0',
            },
            '&::after': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: '-1px',
                left: '-1px',
                right: '-1px',
                bottom: '-1px',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '2px'
            }
        },
        value: {
            position: 'absolute',
            lineHeight: '26px',
            zIndex: 2,
            display: 'flex',
            justifyContent: 'center',
            textAnchor: 'middle',
            margin: 'auto'
        },
        bar: {
            height: '100%',
            position: 'absolute',
            bottom: '0px',
            left: 0,
            right: 0,
            '-webkit-transition': 'max-width 0.7s 0s ease',
            '-moz-transition': 'max-width 0.7s 0s ease',
            '-o-transition': 'max-width 0.7s 0s ease',
            'transition': 'max-width 0.7s 0s ease',
        },
    }),
);

const percentColors = [
    { pct: 0, color: { r: 0xff, g: 0x00, b: 0 } },
    { pct: 50, color: { r: 0xff, g: 0xff, b: 0 } },
    { pct: 100, color: { r: 0x00, g: 0xff, b: 0 } }
];

/**
 * Function to get a color based on percentage value
 *
 * @param {number} pct Percentage value
 * @return {string} css like rgb() color value
 */
const getColorForPercentage = (pct: number) => {
    for (var i = 1; i < percentColors.length - 1; i++) {
        if (pct < percentColors[i].pct) {
            break;
        }
    }
    const lower = percentColors[i - 1];
    const upper = percentColors[i];
    const range = upper.pct - lower.pct;
    const rangePct = (pct - lower.pct) / range;
    const pctLower = 1 - rangePct;
    const pctUpper = rangePct;
    const color = {
        r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
        g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
        b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
    };
    return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
};

interface BatteryProps {
    value: string;
    percentage: number;
}

const Battery = React.memo(function Battery(props: BatteryProps) {
    const { value, percentage } = props;
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div className={classes.value}>{`${value.toLocaleString()} %`}</div>
            <div
                className={clsx(classes.bar)}
                style={{ maxWidth: `${percentage}%`, backgroundColor: getColorForPercentage(percentage) }}
            />
        </div>
    );
});

/**
 * Function to render a Battery-Styled ProgressBar with a Value label and variable color
 *
 * @export
 * @param {CellParams} params
 * @return {*} 
 */
export function renderBatteryPercentage(params: CellParams) {
    return <Battery percentage={Number(params.value)!} value={params.value!.toLocaleString()} />;
}