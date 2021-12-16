import Chip from '@mui/material/Chip';
import CircularProgress, { CircularProgressProps } from '@mui/material/CircularProgress';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import PendingIcon from '@mui/icons-material/Pending';
import Tooltip from '@mui/material/Tooltip';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import CachedIcon from '@mui/icons-material/Cached';


const EllipsisText = (props: any) => {
    const { children } = props
    return (
        <div style={{
            fontSize: "9px",
            width: "100%",

        }}>
            {children}
        </div>
    )
}

export const PendingChip = () => {
    return (
        <>
            <Tooltip title="This project is yet to start">
                <Chip
                    variant="filled"
                    sx={{ width: 60, height: 20, bgcolor: "#ffffffea" }}
                    icon={<PendingIcon sx={{ width: 12, height: 12 }} />}
                    label={<EllipsisText> Pending </EllipsisText>}
                    size="small"
                />
            </Tooltip>
        </>
    )
}

export const SuccessChip = () => {
    return (
        <>
            <Tooltip title={`This sale is successful. You can claim your tokens`} >
                <Chip
                    variant="filled"
                    sx={{ width: 80, height: 20, bgcolor: "#00ff9dea" }}
                    icon={<ThumbUpAltOutlinedIcon sx={{ width: 12, height: 12 }} />}
                    label={<EllipsisText> Successful </EllipsisText>}
                    size="small"
                />
            </Tooltip>
        </>
    )
}

export const FailourChip = () => {
    return (
        <>
            <Tooltip title={`This sale is failed. You can claim your refund`} >
                <Chip
                    variant="filled"
                    sx={{ width: 80, height: 20, bgcolor: "#ec1e1eb5" }}
                    icon={<ThumbDownOutlinedIcon sx={{ width: 12, height: 12 }} />}
                    label={<EllipsisText> Falied </EllipsisText>}
                    size="small"
                />
            </Tooltip>
        </>
    )
}

export const InProgressChip = () => {
    return (
        <>
            <Tooltip title="This project is open for everyone">
                <Chip
                    variant="filled"
                    // color="success"
                    sx={{ width: 80, height: 20, bgcolor: "#d0ff00", marginLeft: "5px" }}
                    icon={<CachedIcon sx={{ width: 12, height: 12 }} />}
                    label={<EllipsisText> In Progress </EllipsisText>}
                    size="small"
                />
            </Tooltip>
        </>
    )
}

export const OpenForAllChip = () => {
    return (
        <>
            <Tooltip title="This project is open for everyone">
                <Chip
                    variant="filled"
                    sx={{ width: 80, height: 20, bgcolor: "#00ff9dea", marginLeft: "5px" }}
                    icon={<LockOpenIcon sx={{ width: 12, height: 12 }} />}
                    label={<EllipsisText> Open for all</EllipsisText>}
                    size="small"
                />
            </Tooltip>
        </>
    )
}

export const OnlyWhitelistedChip = () => {
    return (
        <>
            <Tooltip title="This project is Only for whitelisted members">
                <Chip 
                    variant="filled" 
                    sx={{ width: 95, height: 20, bgcolor: "#f8f551fb" }}
                    icon={<LockIcon sx={{width: 10, height: 10}}/>}
                    label={<EllipsisText> Only Whitelisted </EllipsisText>}
                    size="small"
                    />
            </Tooltip>
        </>
    )
}

export const OnlyTokenHoldersChip = ( {tokenName}:{tokenName:string}) => {
    return (
        <>
            <Tooltip title={`This sale is open for participants who hold at least ${tokenName} Tokens`}>
                <Chip 
                    variant="filled" 
                    sx={{ width: 110, height: 20, bgcolor: "#4551fc9d" }}
                    icon={<LockIcon sx={{width: 10, height: 10}}/>}
                    label={<EllipsisText> Only Token holders </EllipsisText>}
                    size="small"
                    />
            </Tooltip>
        </>
    )
}
