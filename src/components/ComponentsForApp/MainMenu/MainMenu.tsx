import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { urls } from '../../../urls';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import {
    InsertChart,
    Assignment,
    Keyboard,
    ImportExport,
    Contacts,
    FindInPage,
    ExpandLess,
    ExpandMore,
    ContactMail,
} from '@material-ui/icons';
import { Collapse, Typography } from '@material-ui/core';

// -------------- Styles --------------
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
        minHeight:'100vh',
        width: '320px',
        backgroundColor: '#263238',
        position: 'fixed'
    },
    rootResponsive: {
        minHeight:'100%',
        maxWidth: '60px',
        backgroundColor: '#263238',
        position: 'fixed'
    },
    fixed: {
        minHeight:'100vh',
        width: '320px',
    },
    fixedResponsive: {
        minHeight:'100vh',
        width: '60px',
    },
    hidden: {
        display: 'none'
    },
    textPrimary: {
        color: '#ffff',
        fontSize: '1rem'
    },
    icon: {
        color: '#ffff',
        width: '1rem'
    },
    menuTitle: {
        color: '#ffff',
        fontWeight: 'bolder',
        fontSize: '1.6rem',
        textAlign: 'center'
    },
    secondaryMenuTitle:{
        color: '#29b6f6',
        fontSize: '1.3rem'
    },
    logo:{
        width: '1.8rem'
    },
    nestedList:{
        background: '#455a64'
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
  }),
);

// - in this part all the component texts are housed
const texts = {
    itemHeader: {
        title: {
            main: 'Crecer',
            secondary: 'DMC'
        },
        logo: {
            path: '/images/logotipo-crecer-dmc.svg',
            alt: 'logotipo de crecer dmc'
        }
    },
    items: {
        one: {
            title: 'Inicio'
        },
        two: {
            title: 'Administración de terceros',
            list: {
                one: 'Creación de terceros',
                two: 'Migración de terceros'
            }
        },
        three: {
            title: 'Recibos de ingreso / egreso'
        },
        four: {
            title: 'Transacciones internas'
        },
        five: {
            title: 'Reporte de recibos'
        },
        six: {
            title: 'Reporte de transacciones'
        },
    }
}

export default function MainMenu() {

    const classes = useStyles();
    const history = useHistory();

    const [selectedIndex, setSelectedIndex] = React.useState(1);
    const [sizeScreen, setSizeScreen] = useState(900);
    const [open, setOpen] = React.useState({
        one: false
    });

    const matches = useMediaQuery(`(min-width:${sizeScreen}px)`);

    // the list handler works because each item in the list has
    // one identifier (index), so the list handler receive the
    // index and then redirect to a specific url of a component
    // if the item has a nested list will open it.
    // Each main item will have a number from 1 to 9
    // Each nested item will have a number greater than or equal to 10
    const handleListItemClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number,
    ) => {
        setSelectedIndex(index);
        switch (index) {
            case 0:
                history.push(urls.app.main.home);
                break;
            case 1:
                setOpen({
                    one: !open.one
                })
                break;
            case 10:
                history.push(urls.app.main.third.form);
                break;
            case 11:
                history.push(urls.app.main.third.thirdMigrationForm);
                break;
            case 2:
                history.push(urls.app.main.cashReceipt.form);
                break;
            case 3:
                history.push(urls.app.main.internalTransaction.form);
                break;
            case 4:
                history.push(urls.app.main.cashReceipt.report);
                break;
            case 5:
                history.push(urls.app.main.internalTransaction.report);
                break;
            default:
                break;
        }
    };

    return (
        <div className={matches ? classes.fixed : classes.fixedResponsive}>
            <div className={matches ? classes.root : classes.rootResponsive}>
                <List
                component="nav" 
                aria-label="main mailbox folders"
                >
                    <ListItem>
                        <ListItemIcon 
                        onClick={() => {
                            if(sizeScreen === 900){
                                setSizeScreen(100)
                            } else if(sizeScreen === 100){
                                setSizeScreen(900)
                            }
                        }}
                        >
                            <img 
                            className={classes.logo} 
                            src={texts.itemHeader.logo.path} 
                            alt={texts.itemHeader.logo.alt}
                            />
                        </ListItemIcon>
                        <Typography 
                        variant='h6'
                        className={matches ? classes.menuTitle : classes.hidden}
                        >
                            {texts.itemHeader.title.main} <span className={classes.secondaryMenuTitle}>{texts.itemHeader.title.secondary}</span>
                        </Typography>
                    </ListItem>

                    <Divider/>

                    <ListItem
                    button
                    selected={selectedIndex === 0}
                    onClick={(event) => handleListItemClick(event, 0)}
                    >
                        <ListItemIcon
                        className={classes.icon}>
                            <InsertChart/>
                        </ListItemIcon>
                        <ListItemText 
                        primary={texts.items.one.title}
                        className={matches ? classes.textPrimary : classes.hidden}
                        />
                    </ListItem>

                    <ListItem
                    button
                    selected={selectedIndex === 1}
                    onClick={(event) => handleListItemClick(event, 1)}
                    >
                        <ListItemIcon
                        className={classes.icon}
                        >
                            <Contacts/>
                        </ListItemIcon>

                        <ListItemText 
                        primary={texts.items.two.title}
                        className={matches ? classes.textPrimary : classes.hidden}
                        />
                        {
                            matches ?
                                open.one ? <ExpandLess color='primary'/> : <ExpandMore color='secondary'/>
                            :
                            ''
                        }
                    </ListItem>

                    <Collapse 
                    in={open.one} 
                    timeout="auto" 
                    unmountOnExit
                    >
                        <List 
                        component="div" 
                        disablePadding
                        className={classes.nestedList}
                        >
                            <ListItem 
                            button 
                            className={classes.nested}
                            selected={selectedIndex === 10}
                            onClick={(event) => handleListItemClick(event, 10)}
                            >
                                <ListItemIcon 
                                className={classes.icon}>
                                    <ContactMail />
                                </ListItemIcon>
                                <ListItemText 
                                className={matches ? classes.textPrimary : classes.hidden} 
                                primary={texts.items.two.list.one}
                                />
                            </ListItem>

                            <ListItem 
                            button 
                            className={classes.nested}
                            selected={selectedIndex === 11}
                            onClick={(event) => handleListItemClick(event, 11)}
                            >
                                <ListItemIcon 
                                className={classes.icon}>
                                    <ContactMail />
                                </ListItemIcon>
                                <ListItemText 
                                className={matches ? classes.textPrimary : classes.hidden} 
                                primary={texts.items.two.list.two}
                                />
                            </ListItem>
                        </List>
                    </Collapse>

                    <ListItem
                    button
                    selected={selectedIndex === 2}
                    onClick={(event) => handleListItemClick(event, 2)}
                    >
                        <ListItemIcon 
                        className={classes.icon}
                        >
                            <Keyboard />
                        </ListItemIcon>

                        <ListItemText 
                        primary={texts.items.three.title}
                        className={matches ? classes.textPrimary : classes.hidden} 
                        />
                    </ListItem>

                    <ListItem
                    button
                    selected={selectedIndex === 3}
                    onClick={(event) => handleListItemClick(event, 3)}
                    >
                        <ListItemIcon
                        className={classes.icon}
                        >
                            <ImportExport />
                        </ListItemIcon>

                        <ListItemText 
                        primary={texts.items.four.title}
                        className={matches ? classes.textPrimary : classes.hidden} 
                        />
                    </ListItem>

                    <ListItem
                    button
                    selected={selectedIndex === 4}
                    onClick={(event) => handleListItemClick(event, 4)}
                    >
                        <ListItemIcon
                        className={classes.icon}
                        >
                            <FindInPage />
                        </ListItemIcon>

                        <ListItemText 
                        primary={texts.items.five.title}
                        className={matches ? classes.textPrimary : classes.hidden} 
                        />
                    </ListItem>

                    <ListItem
                    button
                    selected={selectedIndex === 5}
                    onClick={(event) => handleListItemClick(event, 5)}
                    >
                        <ListItemIcon
                        className={classes.icon}
                        >
                            <Assignment />
                        </ListItemIcon>

                        <ListItemText 
                        primary={texts.items.six.title}
                        className={matches ? classes.textPrimary : classes.hidden} 
                        />
                    </ListItem>

                </List>

                <Divider />
            </div>
        </div>
    );
}
